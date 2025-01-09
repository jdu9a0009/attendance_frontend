import React from 'react';
import NewDepartmentTable from '../components/Table/NewDepartmentTable'; 

const NewTablePage = () => {
  return (
    <div>
      {/* Просто рендерим компонент без передачи данных */}
      <NewDepartmentTable/>
    </div>
  );
};

export default NewTablePage;
