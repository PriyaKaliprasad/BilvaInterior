import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loader } from "@progress/kendo-react-indicators";
import { Button } from "@progress/kendo-react-buttons";
import NewProject from "./NewProject";
import EditProject from "./EditProject";

/*
  ProjectsAll (inline-styles only) - updated per your request
  - All styling inline (no external CSS).
  - Reduced tile height and tightened spacing.
  - Header puts project name at top-left; Edit button is shifted down slightly
    so there's visible space above it (the "space from above above edit" you asked for).
  - Body labels are kept bold with compact spacing like your example.
*/

const ProjectsAll = () => {
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [columns, setColumns] = useState(3);
  const location = useLocation();
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Layout constants
  const TILE_WIDTH = 380; // px target width per tile
  const TILE_HEIGHT = 230; // reduced height to make tiles less tall
  const TILE_GAP = 20; // px gap between tiles

  // Fetch
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

  // mount / location change
  useEffect(() => {
    const controller = new AbortController();
    fetchAllData(controller.signal);
    return () => controller.abort();
    // eslint-disable-next-line
  }, [API_BASE, location.key, location.pathname, location.state?.refresh]);

  // responsive columns (JS-driven)
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

  const handleRefreshClick = async () => {
    await fetchAllData();
  };

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  // Action bar styles (consistent with SiteVisitAll)
  const actionBarStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    background: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0.5rem 0.5rem 0.5rem',
    borderBottom: '1px solid #eee',
    minHeight: 48,
    marginBottom: 10,
  };
  const actionBarBtnGroup = {
    display: 'flex',
    gap: '0.5rem',
  };

  const getCompanyName = (project) =>
    project.tieUpCompany?.companyName ||
    (project.tieUpCompanyId
      ? companies.find((c) => String(c.id) === String(project.tieUpCompanyId))?.companyName
      : "N/A") ||
    "N/A";

  const getMemberNames = (project) =>
    (members
      .filter((m) => Array.isArray(project.memberIds) && project.memberIds.includes(m.id))
      .map((m) => `${m.firstName} ${m.lastName}`)
      .join(", ")) || "No members assigned";

  if (loading) {
    return (
      <div style={{ padding: 16 }}>
        <div style={actionBarStyle} className="projects-action-bar">
          <div style={actionBarBtnGroup}>
            <Button
              icon="refresh"
              size="small"
              onClick={handleRefreshClick}
              className="action-btn refresh-btn"
            >
              <span className="tieup-action-btn-text">Refresh</span>
            </Button>
          </div>
          <div style={actionBarBtnGroup}>
            <Button
              icon="plus"
              size="small"
              onClick={() => setShowAdd(true)}
              themeColor="primary"
              className="action-btn add-btn"
            >
              <span className="tieup-action-btn-text">Add</span>
            </Button>
          </div>
        </div>

        <div style={{ padding: 40, textAlign: "center" }}>
          <Loader size="large" type="infinite-spinner" />
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (showAdd) {
    return (
      <div style={{ padding: 16 }}>
        <div style={actionBarStyle} className="projects-action-bar">
          <div style={actionBarBtnGroup}>
            <Button
              icon="refresh"
              size="small"
              onClick={handleRefreshClick}
              className="action-btn refresh-btn"
            >
              <span className="tieup-action-btn-text">Refresh</span>
            </Button>
          </div>
          <div style={actionBarBtnGroup}>
            <Button
              icon="plus"
              size="small"
              onClick={() => setShowAdd(true)}
              themeColor="primary"
              className="action-btn add-btn"
            >
              <span className="tieup-action-btn-text">Add</span>
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button
            icon="arrow-left"
            size="small"
            onClick={() => setShowAdd(false)}
            className="action-btn back-btn"
            style={{ marginRight: 8 }}
          >
            <span className="tieup-action-btn-text">Back</span>
          </Button>
        </div>

        <NewProject
          onCancel={(response) => {
            setShowAdd(false);
            if (response?.success) {
              setSuccessMessage(response.message);
              fetchAllData();
            }
          }}
        />
      </div>
    );
  }

  if (editId) {
    return (
      <div style={{ padding: 16 }}>
        <div style={actionBarStyle} className="projects-action-bar">
          <div style={actionBarBtnGroup}>
            <Button
              icon="refresh"
              size="small"
              onClick={handleRefreshClick}
              className="action-btn refresh-btn"
            >
              <span className="tieup-action-btn-text">Refresh</span>
            </Button>
          </div>
          <div style={actionBarBtnGroup}>
            <Button
              icon="plus"
              size="small"
              onClick={() => setShowAdd(true)}
              themeColor="primary"
              className="action-btn add-btn"
            >
              <span className="tieup-action-btn-text">Add</span>
            </Button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Button
            icon="arrow-left"
            size="small"
            onClick={() => setEditId(null)}
            className="action-btn back-btn"
            style={{ marginRight: 8 }}
          >
            <span className="tieup-action-btn-text">Back</span>
          </Button>
        </div>

        <EditProject
          projectId={editId}
          onBack={(response) => {
            setEditId(null);
            if (response?.success) {
              setSuccessMessage(response.message || "Project updated successfully.");
              fetchAllData();
            }
          }}
        />
      </div>
    );
  }

  if (!loading && (!Array.isArray(projects) || projects.length === 0)) {
    return (
      <div style={{ padding: 24 }}>
        <div style={actionBarStyle} className="projects-action-bar">
          <div style={actionBarBtnGroup}>
            <Button
              icon="refresh"
              size="small"
              onClick={handleRefreshClick}
              className="action-btn refresh-btn"
            >
              <span className="tieup-action-btn-text">Refresh</span>
            </Button>
          </div>
          <div style={actionBarBtnGroup}>
            <Button
              icon="plus"
              size="small"
              onClick={() => setShowAdd(true)}
              themeColor="primary"
              className="action-btn add-btn"
            >
              <span className="tieup-action-btn-text">Add</span>
            </Button>
          </div>
        </div>

        <h3>All Projects</h3>
        <p>No projects found.</p>
      </div>
    );
  }

  // compute inline style values based on columns (no external CSS)
  const containerMaxWidth =
    columns === 1 ? "100%" : `${columns * TILE_WIDTH + (columns - 1) * TILE_GAP}px`;

  // tile width: for small screens (columns===1) full width, else fixed TILE_WIDTH
  const getTileStyle = () => {
    if (columns === 1) {
      return {
        width: "100%",
        minHeight: TILE_HEIGHT,
        boxSizing: "border-box",
      };
    }
    return {
      width: `${TILE_WIDTH}px`,
      height: `${TILE_HEIGHT}px`,
      boxSizing: "border-box",
    };
  };

  // container style (flex-wrap)
  const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: `${TILE_GAP}px`,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    maxWidth: containerMaxWidth,
    width: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
  };

  // Action bar styles (consistent with SiteVisitAll)
  

  // tile shared inline style
  const tileBaseStyle = {
    borderRadius: 6,
    overflow: "hidden",
    backgroundColor: "#fff",
    boxShadow: "0 0 0 1px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    border: "1px solid rgba(0,0,0,0.06)",
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={actionBarStyle} className="projects-action-bar">
        <div style={actionBarBtnGroup}>
          <Button
            icon="refresh"
            size="small"
            onClick={handleRefreshClick}
            className="action-btn refresh-btn"
          >
            <span className="tieup-action-btn-text">Refresh</span>
          </Button>
        </div>
        <div style={actionBarBtnGroup}>
          <Button
            icon="plus"
            size="small"
            onClick={() => setShowAdd(true)}
            themeColor="primary"
            className="action-btn add-btn"
          >
            <span className="tieup-action-btn-text">Add</span>
          </Button>
        </div>
      </div>

      {/* GLOBAL SUCCESS TOAST MESSAGE */}
      {successMessage && (
        <div className="success-box" style={{ marginBottom: 12 }}>
          {successMessage}
        </div>
      )}

      <h3 style={{ marginTop: 0 }}>All Projects</h3>
      <div style={gridStyle}>
        {projects.map((project) => {
          const key = project.id ?? project._id ?? Math.random().toString(36).slice(2);
          const companyName = getCompanyName(project);
          const projectMemberNames = getMemberNames(project);

          const tileStyle = { ...tileBaseStyle, ...getTileStyle() };

          return (
            <div key={key} style={tileStyle} aria-label={`project-${project.projectName}`}>
              {/* Header (inline styles, compact) */}
              <div
                style={{
                  padding: 0,
                  backgroundColor: "#f5f5f5",
                  borderBottom: "1px solid #ddd",
                  boxSizing: "border-box",
                  width: "100%",
                }}
              >
                {/* Top row: project name left, edit button top-right but shifted down slightly */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start", // start so we can give edit a top-space
                    justifyContent: "space-between",
                    padding: 0,
                    margin: 0,
                    minHeight: 40,
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      paddingLeft: 8,
                      paddingTop: 6,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: 700,
                      textAlign: "left",
                      flex: 1,
                      fontSize: 15,
                    }}
                    title={project.projectName}
                  >
                    {project.projectName}
                  </div>

                  <div style={{ paddingRight: 8, flex: "0 0 auto" }}>
                    <button
                      onClick={() => setEditId(project.id)}
                      style={{
                        padding: "6px 10px",
                        fontSize: 13,
                        border: "1px solid #ccc",
                        borderRadius: 6,
                        backgroundColor: "#007bff",
                        color: "#fff",
                        cursor: "pointer",
                        // space above the edit button: moves it down a little so it's not flush with the top
                        marginTop: 8,
                      }}
                      aria-label={`Edit ${project.projectName}`}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Second header line: compact stats */}
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 0,
                    marginLeft: 8,
                    marginBottom: 6,
                    fontWeight: 600,
                    fontSize: 13,
                    boxSizing: "border-box",
                  }}
                >
                  <span style={{ display: "inline-block" }}>
                    <strong>Completion:</strong> {project.completion ?? 0}%
                  </span>
                  <span style={{ display: "inline-block" }}>
                    <strong>Cost:</strong> ₹{project.cost?.toLocaleString?.() ?? 0}
                  </span>
                </div>
              </div>

              {/* Body (compact label: value rows) */}
              <div
                style={{
                  padding: 10, // tighter padding
                  boxSizing: "border-box",
                  fontSize: 13,
                  lineHeight: 1.25, // tighter lines
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                <p style={{ margin: "6px 0" }}>
                  <strong style={{ display: "inline-block", minWidth: 98 }}>Description:</strong>{" "}
                  <span style={{ fontWeight: 400 }}>{project.description || "No description available."}</span>
                </p>

                <p style={{ margin: "6px 0" }}>
                  <strong style={{ display: "inline-block", minWidth: 98 }}>Tie-up Company:</strong>{" "}
                  <span style={{ fontWeight: 400 }}>{companyName}</span>
                </p>

                <p style={{ margin: "6px 0" }}>
                  <strong style={{ display: "inline-block", minWidth: 98 }}>Project Members:</strong>{" "}
                  <span style={{ fontWeight: 400 }}>{projectMemberNames}</span>
                </p>

                <p style={{ margin: "6px 0" }}>
                  <strong style={{ display: "inline-block", minWidth: 98 }}>Address:</strong>{" "}
                  <span style={{ fontWeight: 400 }}>{project.address || "No address provided"}</span>
                </p>

                <p style={{ margin: "6px 0" }}>
                  <strong style={{ display: "inline-block", minWidth: 98 }}>Location:</strong>{" "}
                  {project.location ? (
                    <a
                      href={project.location}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#007bff", wordBreak: "break-word", fontWeight: 400 }}
                    >
                      View on Map
                    </a>
                  ) : (
                    <span style={{ fontWeight: 400 }}>No location link available</span>
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsAll;