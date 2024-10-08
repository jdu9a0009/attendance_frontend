import React from 'react';
import NewDepartmentTable from '../../admin/components/Table/NewDepartmentTable'; 

const BigTablePage = () => {
  return (
    <div>
      <h1></h1>
      {/* Просто рендерим компонент без передачи данных */}
      <NewDepartmentTable/>
    </div>
  );
};

export default BigTablePage;
