import React, { useEffect, useState } from "react";
import { TileLayout } from "@progress/kendo-react-layout";
import { Loader } from "@progress/kendo-react-indicators";

const ProjectsAll = () => {
  const [projects, setProjects] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(2);
  const [positions, setPositions] = useState([]);
  const [tiles, setTiles] = useState([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  // Fetch projects, companies, and members
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, companiesRes, membersRes] = await Promise.all([
          fetch(`${API_BASE}/api/Projects`),
          fetch(`${API_BASE}/api/TieUpCompany`),
          fetch(`${API_BASE}/api/Projects/members`)
        ]);

        const [projectsData, companiesData, membersData] = await Promise.all([
          projectsRes.json(),
          companiesRes.json(),
          membersRes.json()
        ]);

        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setCompanies(Array.isArray(companiesData) ? companiesData : []);
        setMembers(Array.isArray(membersData) ? membersData : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Responsive columns
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prepare tiles and positions
  useEffect(() => {
    if (projects.length === 0) return;

    const newTiles = projects.map((project, idx) => {
      // Lookup company by numeric ID
      const company = companies.find((c) => c.id === project.tieUpCompanyId);
      const companyName = company ? company.companyName : "N/A";

      // Map project members
      const projectMemberNames = members
        .filter((m) => project.memberIds?.includes(m.id))
        .map((m) => `${m.firstName} ${m.lastName}`)
        .join(", ") || "No members assigned";

      return {
        key: project.id,
        header: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 12px",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ddd",
              borderTopLeftRadius: "4px",
              borderTopRightRadius: "4px",
              fontWeight: 600
            }}
          >
            <span>{project.projectName}</span>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", fontWeight: 400 }}>
              <span><strong>Completion:</strong> {project.completion || 0}%</span>
              <span><strong>Cost:</strong> ₹{project.cost?.toLocaleString() || 0}</span>
            </div>
          </div>
        ),
        body: (
          <div style={{ padding: "12px" }}>
            <p><strong>Description:</strong> {project.description || "No description available."}</p>
            <p><strong>Tie-up Company:</strong> {companyName}</p>
            <p><strong>Project Members:</strong> {projectMemberNames}</p>
            <p><strong>Address:</strong> {project.address || "No address provided"}</p>
            <p>
              <strong>Location:</strong>{" "}
              {project.location ? (
                <a
                  href={project.location}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#007bff" }}
                >
                  View on Map
                </a>
              ) : (
                "No location link available"
              )}
            </p>
          </div>
        )
      };
    });

    const newPositions = newTiles.map((_, idx) => ({
      col: idx % columns,
      row: Math.floor(idx / columns),
      colSpan: 1,
      rowSpan: 1
    }));

    setTiles(newTiles);
    setPositions(newPositions);
  }, [projects, companies, members, columns]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <Loader size="large" type="infinite-spinner" />
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      {tiles.length > 0 && positions.length > 0 && (
        <TileLayout
          columns={columns}
          rowHeight={350}
          gap={{ rows: 20, columns: 20 }}
          positions={positions}
          items={tiles}
          onReposition={(e) => setPositions(e.value)} // allow moving tiles
        />
      )}

      <div style={{ marginTop: "24px", textAlign: "right" }}>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
    </div>
  );
};

export default ProjectsAll;
