import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, ButtonGroup, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchDashboardList } from '../../../utils/libs/axios';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface Employee {
  id: number;
  employee_id: string | null;
  department: string | null;
  employee_count: string | null;
  full_name: string | null;
  status: boolean | null;
}

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
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [organizedData, setOrganizedData] = useState<OrganizedData>({});
  const [pages, setPages] = useState<DeptInfo[][]>([]);
  const maxColumnsPerPage = 10;
  const maxEmployeesPerColumn = 20;

  useEffect(() => {
    const loadServerData = async () => {
      try {
        const serverData = await fetchDashboardList();
        organizeData(serverData);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };

    loadServerData();
  }, []);

  const organizeData = (data: Employee[]) => {
    const organized: OrganizedData = {};
    data.forEach((employee) => {
      if (employee.department) {
        if (!organized[employee.department]) {
          organized[employee.department] = [];
        }
        organized[employee.department].push(employee);
      }
    });
    setOrganizedData(organized);
  
    const newPages: DeptInfo[][] = [];
    let currentPage: DeptInfo[] = [];
    let currentPageCount = 0;
  
    Object.entries(organized).forEach(([dept, employees]) => {
      const columnsNeeded = Math.ceil(employees.length / maxEmployeesPerColumn);
  
      // Проверяем, поместятся ли все столбцы департамента на текущей странице
      if (currentPageCount + columnsNeeded > maxColumnsPerPage) {
        // Если не помещаются, добавляем текущую страницу и начинаем новую
        newPages.push(currentPage);
        currentPage = [];
        currentPageCount = 0;
      }
  
      // Добавляем столбцы департамента на текущую страницу
      for (let i = 0; i < columnsNeeded; i++) {
        const deptInfo: DeptInfo = { dept, startIndex: i * maxEmployeesPerColumn };
        currentPage.push(deptInfo);
        currentPageCount++;
      }
    });
  
    // Добавляем последнюю страницу, если она не пустая
    if (currentPage.length > 0) {
      while (currentPage.length < maxColumnsPerPage) {
        currentPage.push({ dept: '', startIndex: 0 });
      }
      newPages.push(currentPage);
    }
  
    setPages(newPages);
  };
  

  const renderTableContent = () => {
    if (currentPage >= pages.length) return null;

    const currentPageData = pages[currentPage];
    const rows = [];

    for (let i = 0; i < maxEmployeesPerColumn; i++) {
      const row = (
        <TableRow key={i}>
          {currentPageData.map((deptInfo, columnIndex) => {
            const employee = organizedData[deptInfo.dept]?.[deptInfo.startIndex + i];
            return (
              <StyledTableCell key={columnIndex}>
                {employee && (
                  <EmployeeCell status={employee.status}>
                    {employee.full_name}
                  </EmployeeCell>
                )}
              </StyledTableCell>
            );
          })}
        </TableRow>
      );
      rows.push(row);
    }

    return rows;
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {pages[currentPage]?.map((deptInfo, index) => (
                <StyledTableCell key={index}>
                  <strong>{deptInfo.dept}</strong>
                  {deptInfo.startIndex > 0 ? ' (прод.)' : ''}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </TableContainer>
      <PaginationContainer>
        <ButtonGroup variant="contained" color="primary" size="large">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
            startIcon={<NavigateBeforeIcon />}
          >
            Назад
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(pages.length - 1, prev + 1))}
            disabled={currentPage === pages.length - 1}
            endIcon={<NavigateNextIcon />}
          >
            Вперед
          </Button>
        </ButtonGroup>
        <PageIndicator variant="h6">
          Страница {currentPage + 1} из {pages.length}
        </PageIndicator>
      </PaginationContainer>
    </div>
  );
};

export default NewDepartmentTable;