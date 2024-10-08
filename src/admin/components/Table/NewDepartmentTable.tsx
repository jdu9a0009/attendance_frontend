import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  ButtonGroup,
  Typography,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchDashboardList } from '../../../utils/libs/axios';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTranslation } from 'react-i18next';
import { Employee, Department } from './types';

// interface Employee {
//   id: number;
//   employee_id: string | null;
//   department: string | null;
//   full_name: string | null;
//   status: boolean | null;
// }

// interface Department {
//   department: string;
//   employee_count: string;
// }

interface OrganizedData {
  [key: string]: Employee[];
}

interface DeptInfo {
  dept: string;
  startIndex: number;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  width: '10%',
  height: '60px',
  border: '1px solid rgba(224, 224, 224, 1)',
}));

const EmployeeCell = styled('div')<{ status: boolean | null }>(({ status, theme }) => ({
  backgroundColor: status === true ? '#e8f5e9' : status === false ? '#ffebee' : 'transparent',
  padding: theme.spacing(1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PageIndicator = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 2),
}));

const NewDepartmentTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [organizedData, setOrganizedData] = useState<OrganizedData>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation(['admin']);

  const maxColumnsPerPage = 10;
  const maxEmployeesPerColumn = 20;

  useEffect(() => {
    const loadServerData = async (page: number) => {
      try {
        setLoading(true);
        console.log(`Выполняется запрос для страницы ${page}`);
        const { employee_list, total_employee_count, department } = await fetchDashboardList(page);
        
        if (!employee_list || employee_list.length === 0) {
          setError("Нет данных для отображения.");
          return;
        }
        
        const organized = organizeData(employee_list, department);
        setOrganizedData(organized);
        setDepartments(department);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError("Ошибка при загрузке данных.");
      } finally {
        setLoading(false);
      }
    };
  
    loadServerData(currentPage);
  }, [currentPage]);

  const organizeData = (employeeList: Employee[], departmentList: Department[]): OrganizedData => {
    const organized: OrganizedData = {};
  
    // Сначала добавляем все департаменты
    departmentList.forEach((dept) => {
      organized[dept.department] = [];
    });
  
    // Затем распределяем сотрудников по департаментам
    employeeList.forEach((employee) => {
      if (employee.department) {
        organized[employee.department].push(employee);
      } else {
        console.warn('Сотрудник без департамента:', employee);
      }
    });
  
    console.log('Организованные данные (включая пустые департаменты):', organized);
    return organized;
  };

  const pages = useMemo(() => {
    const result: DeptInfo[][] = [];
    let currentPage: DeptInfo[] = [];
    let currentPageCount = 0;
  
    // Проходим по всем департаментам (включая пустые)
    departments.forEach((dept) => {
      const columnsNeeded = Math.ceil((organizedData[dept.department]?.length || 0) / maxEmployeesPerColumn) || 1;
  
      if (currentPageCount + columnsNeeded > maxColumnsPerPage) {
        if (currentPage.length > 0) {
          result.push(currentPage);
        }
        currentPage = [];
        currentPageCount = 0;
      }
  
      for (let i = 0; i < columnsNeeded; i++) {
        const deptInfo: DeptInfo = { dept: dept.department, startIndex: i * maxEmployeesPerColumn };
        currentPage.push(deptInfo);
        currentPageCount++;
      }
    });
  
    if (currentPage.length > 0) {
      while (currentPage.length < maxColumnsPerPage) {
        currentPage.push({ dept: '', startIndex: 0 });
      }
      result.push(currentPage);
    }
  
    console.log('Сгенерированные страницы с пустыми департаментами:', result);
    return result;
  }, [organizedData, departments]);
  

  const renderTableContent = () => {
    console.log('Вызов renderTableContent');
    console.log('Pages:', pages);
    console.log('Current Page:', currentPage);
    console.log('Organized Data:', organizedData);

    if (pages.length === 0) {
      console.log('Нет сгенерированных страниц');
      return null;
    }
  
    const currentPageIndex = currentPage - 1;
    if (!pages[currentPageIndex] || pages[currentPageIndex].length === 0) {
      console.log('Нет данных для текущей страницы:', currentPage);
      return null;
    }
  
    const currentPageData = pages[currentPageIndex];
  
    console.log('Текущие данные страницы:', currentPageData);
  
    const rows = [];
  
    for (let i = 0; i < maxEmployeesPerColumn; i++) {
      const row = (
        <TableRow key={i}>
          {currentPageData.map((deptInfo, columnIndex) => {
            const employee = organizedData[deptInfo.dept]?.[deptInfo.startIndex + i];
            
            return (
              <StyledTableCell key={columnIndex}>
                {employee ? (
                  <EmployeeCell status={employee.status}>
                    {employee.full_name}
                  </EmployeeCell>
                ) : (
                  <EmployeeCell status={null}>-</EmployeeCell>
                )}
              </StyledTableCell>
            );
          })}
        </TableRow>
      );
      rows.push(row);
    }
  
    console.log('Сгенерированные строки:', rows);
    return rows;
  };

  if (loading) {
    return <Typography>Загрузка данных...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (Object.keys(organizedData).length === 0) {
    return <Typography>Нет данных для отображения.</Typography>;
  }

  return (
    <div>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {pages[currentPage - 1]?.map((deptInfo, index) => (
                <StyledTableCell key={index}>
                  <strong>{deptInfo.dept}</strong>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {renderTableContent()}
          </TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <ButtonGroup variant="contained" color="primary" size="large">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            startIcon={<NavigateBeforeIcon />}
          >
            {t('newTable.back')}
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(pages.length, prev + 1))}
            disabled={currentPage === pages.length}
            endIcon={<NavigateNextIcon />}
          >
            {t('newTable.forward')}
          </Button>
        </ButtonGroup>
        <PageIndicator variant="h6">
          {t('newTable.page')} {currentPage} {t('newTable.of')} {pages.length}
        </PageIndicator>
      </PaginationContainer>
    </div>
  );
};

export default NewDepartmentTable;
