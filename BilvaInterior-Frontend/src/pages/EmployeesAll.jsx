// src/pages/EmployeeAll.jsx
import React, { useState } from 'react';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { orderBy } from '@progress/kendo-data-query';
import 'bootstrap/dist/css/bootstrap.min.css';
import './EmployeeAll.css';


// --- Employee Sample Data ---
const employees = [
  { id: 1, firstName: "John", lastName: "Doe", email: "john.doe@example.com", mobile: "9876543210", role: "Manager", status: "Active" },
  { id: 2, firstName: "Jane", lastName: "Smith", email: "jane.smith@example.com", mobile: "9123456780", role: "Designer", status: "Inactive" },
  { id: 3, firstName: "Amit", lastName: "Kumar", email: "amit.kumar@example.com", mobile: "9898989898", role: "Engineer", status: "Active" },
  { id: 4, firstName: "Priya", lastName: "Sharma", email: "priya.sharma@example.com", mobile: "9811112233", role: "HR", status: "Active" },
  { id: 5, firstName: "Rahul", lastName: "Verma", email: "rahul.verma@example.com", mobile: "9822334455", role: "Supervisor", status: "Inactive" },
];

// --- Custom Cell Renderers for Status and Actions ---
const StatusCell = (props) => {
  const { status } = props.dataItem;
  return (
    <td className="text-center">
      <span className={`badge ${status === "Active" ? "status-active" : "status-inactive"}`}>
        {status}
      </span>
    </td>
  );
};
const ActionCell = () => {
  return (
    <td className="text-center">
      <Button size="small" themeColor="primary">Edit</Button>
    </td>
  );
};


const EmployeeAll = () => {
  // --- State for Pagination ---
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(5); // Items per page
  
  // --- State for Sorting ---
  const [sort, setSort] = useState([{ field: 'firstName', dir: 'asc' }]);

  const handlePageChange = (event) => {
    setSkip(event.page.skip);
    setTake(event.page.take);
  };
  
  const handleSortChange = (event) => {
    setSort(event.sort);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm p-4">
        {/* <div className="d-flex justify-content-between align-items-center mb-3">
            
            <Button themeColor="primary">Add new Employee</Button>
        </div> */}
        
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
          <GridColumn title="Actions" cell={ActionCell} sortable={false} className="text-center" />
        </Grid>
      </div>
    </div>
  );
};

export default EmployeeAll;