import React, { useState, useEffect } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { Dialog } from '@progress/kendo-react-dialogs';
import { orderBy } from '@progress/kendo-data-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EmployeeAll.css';

// --- Custom Cell Renderers for Status and Actions ---
const StatusCell = (props) => {
  console.log(props);
  const { status } = props.dataItem;
  return (
    <td className="text-center">
      <span className={`badge ${status === true ? "status-active" : "status-inactive"}`}>
        {/* {status} */}
        {status ? "Active" : "Inactive"}
      </span>
    </td>
  );
};

const ActionCell = (props) => {
  return (
    <td className="text-center">
      <Button
        size="small"
        themeColor="primary"
        onClick={() => props.onEdit(props.dataItem)}
      >
        Edit
      </Button>
    </td>
  );
};

const EmployeeAll = () => {
  // --- State for employees (fetched from backend) ---
  const [employees, setEmployees] = useState([]);

  // --- State for Pagination ---
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(5);

  // --- State for Sorting ---
  const [sort, setSort] = useState([{ field: 'firstName', dir: 'asc' }]);

  // --- State for Dialog ---
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  const API_BASE = "https://localhost:7142/api/Employee";

  // Load employees from backend
  useEffect(() => {
    fetch(API_BASE)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const handlePageChange = (event) => {
    setSkip(event.page.skip);
    setTake(event.page.take);
  };

  const handleSortChange = (event) => {
    setSort(event.sort);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee({ ...employee }); // copy object
    setSaveMessage("");
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: name === "status" ? value === "true" : value,
    }));
  };

  const handleSave = () => {
    fetch(`${API_BASE}/${selectedEmployee.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(selectedEmployee),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to save employee (Status: ${res.status})`);
        }
        return res.json();
      })
      .then((data) => {
        // Update frontend state immediately
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployee.id ? selectedEmployee : emp
          )
        );
        setSaveMessage(data.message || "Employee details saved successfully ✅");
      })
      .catch((err) => {
        console.error("Error updating employee:", err);
        setSaveMessage("❌ Failed to save employee details");
      });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        <div className="grid-responsive-wrapper">
          <Grid
            data={orderBy(employees, sort).slice(skip, skip + take)}
            pageable={true}
            sortable={true}
            skip={skip}
            take={take}
            total={employees.length}
            onPageChange={handlePageChange}
            sort={sort}
            onSortChange={handleSortChange}
            style={{ height: 'auto', border: 'none' }}
          >
            <GridColumn field="firstName" title="First Name" />
            <GridColumn field="lastName" title="Last Name" />
            <GridColumn field="email" title="Email" width="250px" />
            <GridColumn field="mobile" title="Mobile" />
            <GridColumn field="role" title="Role" />
            <GridColumn field="status" title="Status" cell={StatusCell} className="text-center" />
            <GridColumn
              title="Actions"
              cell={(props) => <ActionCell {...props} onEdit={handleEdit} />}
              sortable={false}
              className="text-center"
            />
          </Grid>
        </div>
      </div>

      {/* --- Dialog Box --- */}
      {openDialog && selectedEmployee && (
        <Dialog title="Edit Employee" onClose={() => setOpenDialog(false)} width={500}>
          <div className="mb-2">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={selectedEmployee.firstName}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={selectedEmployee.lastName}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          {/* <div className="mb-2">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={selectedEmployee.email}
              onChange={handleInputChange}
              className="form-control"
            />
          </div> */}
          <div className="mb-2">
            <label>Mobile:</label>
            <input
              type="text"
              name="mobile"
              value={selectedEmployee.mobile}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label>Role:</label>
            <input
              type="text"
              name="role"
              value={selectedEmployee.role}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label>Status:</label>
            <select
              name="status"
              value={selectedEmployee.status}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <Button themeColor="primary" onClick={handleSave}>Save</Button>
            <Button themeColor="secondary" onClick={() => setOpenDialog(false)}>Cancel</Button>
          </div>

          {/* Success Message */}
          {saveMessage && (
            <div className="alert alert-success mt-3 text-center">{saveMessage}</div>
          )}
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeAll;

