import React, { useState, useEffect } from 'react'; 
import { Box, Paper, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import EmployeeTable from '../components/Table/EmployeeTable';
import EditModal from '../components/Table/EditModal';
import CreateEmployeeModal from '../components/Table/CreateEmployeeModal';
import UploadExcelModal from '../components/Table/UploadExcelModal';
import { TableData, Column } from '../components/Table/types';
import axiosInstance, { updateUser, fetchDepartments, fetchPositions, fetchQRCodeList } from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';

export interface Department {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
  department_id: number;
  department: string;
}

const EmployeeListPage: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<TableData | null>(null);
  const [employeeData, setEmployeeData] = useState<TableData[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const { t } = useTranslation('admin');
  const [userCreated, setUserCreated] = useState(false);

  const columns: Column[] = [
    { id: 'employee_id', label: t('employeeTable.employeeId') },
    { id: 'full_name', label: t('employeeTable.fullName') },
    { id: 'nick_name', label: t('employeeTable.nickName') },
    { id: 'department', label: t('employeeTable.department') },
    { id: 'position', label: t('employeeTable.position') },
    { id: 'phone', label: t('employeeTable.phone') },
    { id: 'email', label: t('employeeTable.email') },
    { id: 'action', label: t('employeeTable.action') },
  ];

  const buttonStyles = {
    base: {
      height: 40,
      textTransform: 'none',
      borderRadius: 2,
    },
    primary: {
      bgcolor: '#00D891',
      '&:hover': { bgcolor: '#00AB73' },
    },
    withMargin: {
      ml: 1.5
    }
  };

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetchDepartments();
  
        if (response) {
          // Проверяем наличие данных перед их использованием
          const { departments, nextDisplayNumber } = response;
  
          // Если departments и nextDisplayNumber существуют, устанавливаем их
          if (departments && nextDisplayNumber !== undefined) {
            setDepartments(departments);
            // Здесь добавь логику для использования nextDisplayNumber
          }
        }
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };
  
    const loadPositions = async () => {
      try {
        const response = await fetchPositions();
        setPositions(response); 
      } catch (error) {
        console.error("Failed to fetch positions", error);
      }
    };
  
    loadDepartments();
    loadPositions();
  }, []);
  

  const handleEditOpen = (employee: TableData) => {
    // Преобразование данных для EditModal
    const transformedEmployee = {
      id: employee.id,
      employee_id: employee.employee_id,
      full_name: employee.full_name,
      first_name: employee.full_name.split(' ')[0], 
      last_name: employee.full_name.split(' ')[1] || '', 
      nick_name: employee.nick_name, 
      role: employee.role || "Employee", 
      department: employee.department,
      position: employee.position,
      phone: employee.phone,
      email: employee.email,
      password: '', 
      forget_leave: false,
    };
  
    console.log("Transformed employee data: ", transformedEmployee);
    setSelectedEmployee(transformedEmployee);
    setEditModalOpen(true);
  };

  const handleEditSave = async (updatedEmployee: TableData) => {
    try {
      console.log('123: ', updatedEmployee);
      
      await updateUser(
        updatedEmployee.id,
        updatedEmployee.employee_id,
        updatedEmployee.password!,
        updatedEmployee.role!,
        updatedEmployee.first_name!,
        updatedEmployee.last_name!,
        updatedEmployee.department_id!,
        updatedEmployee.position_id!,
        updatedEmployee.phone!,
        updatedEmployee.email!,
        updatedEmployee.nick_name!,
      );
      setUserCreated(prev => !prev);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };

  const handleCreateSave = (newEmployee: TableData) => {
    setEmployeeData(prevData => [...prevData, newEmployee]);
    setCreateModalOpen(false);
    setUserCreated(prev => !prev);
  };
  

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance().delete(`/user/${id}`);
    } catch (error) {
      console.error('Ошибка при удалении сотрудника:', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      // const response = await uploadExcelFile(formData);

      console.log('Файл успешно загружен:');
      setUploadModalOpen(false);
      setUserCreated(prev => !prev);
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
    }
  };

  const handleDownloadQRCodes = async () => {
    try {
      const response = await fetchQRCodeList();
  
      // Проверяем, является ли ответ валидным Blob
      if (!(response instanceof Blob)) {
        throw new Error('Неверный формат ответа');
      }
  
      // Создаем новый Blob с правильным MIME-типом
      const pdfBlob = new Blob([response], { type: 'application/pdf' });
  
      // Создаем временный URL для Blob
      const url = window.URL.createObjectURL(pdfBlob);
  
      // Создаем временный элемент ссылки
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'qrcodes.pdf');
      
      // Добавляем в документ, кликаем и удаляем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Освобождаем URL для очистки памяти
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при загрузке QR-кодов:", error);
      alert(" QRコードの読み込みに失敗しました。もう一度お試しください。");
    }
  };

  const handleExportEmployees = async () => {
    try {
      const response = await axiosInstance().get('/user/export_employee', {
        responseType: 'blob', // Ожидаем, что сервер вернет файл в виде Blob
      });
  
      if (!(response.data instanceof Blob)) {
        throw new Error('Неверный формат ответа');
      }
  
      // Изменяем MIME-тип на Excel
      const excelBlob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(excelBlob);
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employees.xlsx'); // Изменили имя файла на .xlsx
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Ошибка при экспорте сотрудников:", error);
      alert("従業員のエクスポートに失敗しました。再試行してください。");
    }
  };
  
  

  return (
    <>
      {/* Убрали лишний Box */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '10px 10px 0 0',
          padding: '14px',
          marginBottom: '-1px',
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Левая группа кнопок */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ ...buttonStyles.base, ...buttonStyles.primary }}
          >
            {t('employeeList.createButton')}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadModalOpen(true)}
            sx={{ ...buttonStyles.base, ...buttonStyles.primary }}
          >
            {t('employeeList.uploadButton')}
          </Button>
        </Box>

        {/* Правая группа кнопок */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            onClick={handleDownloadQRCodes}
            sx={{ ...buttonStyles.base, ...buttonStyles.primary }}
          >
            {t('employeeList.downloadQRCodesButton')}
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportEmployees}
            sx={{ ...buttonStyles.base, ...buttonStyles.primary }}
          >
            {t('Export')}
          </Button>
        </Box>
      </Paper>

      {/* Таблица сотрудников */}
      <EmployeeTable
        departments={departments}
        positions={positions}
        columns={columns}
        onEdit={handleEditOpen}
        onDelete={handleDelete}
        tableTitle={t('employeeTable.title')}
        showCalendar={false}
        userCreated={userCreated}
      />

      {/* Модальные окна */}
      <EditModal
        departments={departments}
        positions={positions}
        open={editModalOpen}
        data={selectedEmployee}
        onClose={() => setEditModalOpen(false)}
        onSave={handleEditSave}
        userCreated={userCreated}
      />
      <CreateEmployeeModal
        departments={departments}
        positions={positions}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSave={handleCreateSave}
      />
      <UploadExcelModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={handleFileUpload}
      />
    </>
  );
};

export default EmployeeListPage;