import React from 'react';
import NewDepartmentTable from '../components/Table/NewDepartmentTable';

const NewTablePage = () => {
  return (
    <div className="container">
      <h1>Department Table</h1> {/* Add a descriptive heading */}
      <NewDepartmentTable />
    </div>
  );
};

export default NewTablePage;