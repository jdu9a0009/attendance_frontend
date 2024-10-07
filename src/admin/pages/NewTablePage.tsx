import React from 'react';
import NewDepartmentTable from '../components/Table/NewDepartmentTable'; // Подключаем компонент с таблицей

const NewTablePage = () => {
  return (
    <div>
      <h1>Страница с таблицей</h1>
      {/* Просто рендерим компонент без передачи данных */}
      <NewDepartmentTable/>
    </div>
  );
};

export default NewTablePage;
