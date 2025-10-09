import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TileLayout } from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";

/*
  ProjectsAll (TileLayout version)
  - Uses Kendo TileLayout.
  - Forces exactly 3 columns on desktop, 2 on tablet, 1 on mobile (breakpoints).
  - Ensures tiles have a fixed visual size so adding/moving projects does NOT change neighboring tile sizes.
  - Header uses two lines (name, then completion/cost).
  - Edit button is absolutely positioned.
  - Positions are computed deterministically.
  - Contains all layout/CSS inline (no external CSS file).
*/

const ProjectsAll = () => {
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // columns controlled by breakpoints (desktop=3, tablet=2, mobile=1)
  const [columns, setColumns] = useState(3);
  const [positions, setPositions] = useState([]);
  const [tiles, setTiles] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Use a ref to avoid stale closures when computing positions
  const columnsRef = useRef(columns);
  columnsRef.current = columns;

  // Centralized fetch used by buttons and effects
  const fetchAllData = async (signal) => {
    setLoading(true);
    try {
      const [projectsRes, companiesRes, membersRes] = await Promise.all([
        fetch(`${API_BASE}/api/Projects`, { signal }),
        fetch(`${API_BASE}/api/TieUpCompany`, { signal }),
        fetch(`${API_BASE}/api/Projects/members`, { signal }),
      ]);
      if (!projectsRes.ok) throw new Error(`Projects API ${projectsRes.status}`);
      if (!companiesRes.ok) throw new Error(`Companies API ${companiesRes.status}`);
      if (!membersRes.ok) throw new Error(`Members API ${membersRes.status}`);

      const [projectsData, companiesData, membersData] = await Promise.all([
        projectsRes.json(),
        companiesRes.json(),
        membersRes.json(),
      ]);

      setProjects(Array.isArray(projectsData) ? projectsData : []);
      setCompanies(Array.isArray(companiesData) ? companiesData : []);
      setMembers(Array.isArray(membersData) ? membersData : []);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("ProjectsAll fetch error:", err);
        setProjects([]);
        setCompanies([]);
        setMembers([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount / location changes (supports cancellation)
  useEffect(() => {
    const controller = new AbortController();
    fetchAllData(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line
  }, [API_BASE, location.key, location.pathname, location.state?.refresh]);

  // Responsive breakpoints: enforce columns = 3|2|1
  useEffect(() => {
    const computeColumns = () => {
      const w = window.innerWidth;
      if (w >= 1200) setColumns(3);
      else if (w >= 768) setColumns(2);
      else setColumns(1);
    };
    computeColumns();
    window.addEventListener("resize", computeColumns);
    return () => window.removeEventListener("resize", computeColumns);
  }, []);

  // Build tiles and fixed positions when data or columns change
  useEffect(() => {
    // create tile items for TileLayout
    const newTiles = (Array.isArray(projects) ? projects : []).map((project) => {
      const companyName =
        project.tieUpCompany?.companyName ||
        (project.tieUpCompanyId
          ? companies.find((c) => String(c.id) === String(project.tieUpCompanyId))?.companyName
          : "N/A") ||
        "N/A";

      const projectMemberNames =
        (members
          .filter((m) => Array.isArray(project.memberIds) && project.memberIds.includes(m.id))
          .map((m) => `${m.firstName} ${m.lastName}`)
          .join(", ")) || "No members assigned";

      return {
        key: project.id,
        header: (
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ddd",
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              fontWeight: 700,
              fontSize: 14,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 6,
              boxSizing: "border-box",
            }}
          >
            {/* first line: project name */}
            <div style={{ display: "flex", alignItems: "center", minHeight: 28 }}>
              <span
                style={{
                  flex: 1,
                  minWidth: 120,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {project.projectName}
              </span>
            </div>

            {/* second line: completion & cost - forced to second line */}
            <div
              style={{
                display: "flex",
                gap: 16,
                alignItems: "center",
                whiteSpace: "nowrap",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              <span>
                <strong>Completion:</strong> {project.completion || 0}%
              </span>
              <span>
                <strong>Cost:</strong> ₹{project.cost?.toLocaleString() || 0}
              </span>
            </div>

            {/* Edit button absolutely positioned in header top-right */}
            <button
              onClick={() => navigate(`/projects/edit/${project.id}`)}
              style={{
                position: "absolute",
                right: 8,
                top: 8,
                padding: "6px 10px",
                fontSize: 13,
                border: "1px solid #ccc",
                borderRadius: 4,
                backgroundColor: "#007bff",
                color: "#fff",
                cursor: "pointer",
                zIndex: 2,
              }}
              aria-label={`Edit ${project.projectName}`}
            >
              Edit
            </button>
          </div>
        ),
        body: (
          <div
            style={{
              padding: 14,
              boxSizing: "border-box",
              fontSize: 13,
              lineHeight: 1.4,
            }}
          >
            <p>
              <strong>Description:</strong> {project.description || "No description available."}
            </p>
            <p>
              <strong>Tie-up Company:</strong> {companyName}
            </p>
            <p>
              <strong>Project Members:</strong> {projectMemberNames}
            </p>
            <p>
              <strong>Address:</strong> {project.address || "No address provided"}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {project.location ? (
                <a href={project.location} target="_blank" rel="noreferrer" style={{ color: "#007bff", wordBreak: "break-word" }}>
                  View on Map
                </a>
              ) : (
                "No location link available"
              )}
            </p>
          </div>
        ),
      };
    });

    // deterministic positions: col = idx % columns, row = floor(idx / columns)
    const newPositions = newTiles.map((_, idx) => ({
      col: idx % columnsRef.current,
      row: Math.floor(idx / columnsRef.current),
      colSpan: 1,
      rowSpan: 1,
    }));

    setTiles(newTiles);
    setPositions(newPositions);
  }, [projects, companies, members, columns, navigate]);

  // top refresh used by the UI
  const handleRefreshClick = async () => {
    await fetchAllData();
  };

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Loader size="large" type="infinite-spinner" />
        <p>Loading projects...</p>
      </div>
    );
  }

  if (!loading && (!Array.isArray(projects) || projects.length === 0)) {
    return (
      <div style={{ padding: 24 }}>
        <h3>All Projects</h3>
        <p>No projects found.</p>
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button
            onClick={handleRefreshClick}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #ccc",
              backgroundColor: "#f5f5f5",
              cursor: "pointer",
            }}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  /*
    Important TileLayout props used:
    - columns: number of columns to render (we compute strictly).
    - rowHeight: fixed pixel height per 'row unit'. Using rowHeight + rowSpan = 1 gives each tile a fixed height.
      Choose rowHeight to accommodate header + body content and keep tiles equal height.
    - gap: spacing between tiles.
    - positions: deterministic positions array so TileLayout places exactly N columns per row.
    - style: width 100% to fill parent.
  */
  return (
    <div style={{ padding: 16, maxWidth: 1400, margin: "0 auto" }}>
      <h3>All Projects</h3>

      {/* <div style={{ marginTop: 12, marginBottom: 12, display: "flex", alignItems: "center" }}>
        <button
          onClick={handleRefreshClick}
          style={{
            padding: "8px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
            marginRight: 12,
          }}
        >
          ⟳ Refresh
        </button>

        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={() => navigate("/projects/new")}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #0d6efd",
              backgroundColor: "#0d6efd",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            + New Project
          </button>
        </div>
      </div> */}

      <TileLayout
        style={{ width: "100%" }}
        columns={columns}
        rowHeight={420}            /* fixed visual tile height (adjust if you need taller/shorter) */
        gap={{ rows: 20, columns: 20 }}
        positions={positions}
        items={tiles}
        onReposition={(e) => {
          // keep positions state in sync if user reorders tiles via TileLayout drag
          // we maintain colSpan/rowSpan = 1 so tile sizes remain identical
          setPositions(e.value);
        }}
      />
    </div>
  );
};

export default ProjectsAll;