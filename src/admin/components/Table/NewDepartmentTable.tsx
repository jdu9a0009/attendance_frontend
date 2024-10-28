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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Modal,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { fetchDashboardList } from '../../../utils/libs/axios';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTranslation } from 'react-i18next';

interface DepartmentData {
  department_name: string;
  display_number: number;
  result: EmployeeData[];
}

interface EmployeeData {
  id: number;
  employee_id: string;
  department_id: number;
  department_name: string;
  display_number: number;
  full_name: string;
  status: boolean;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '60px',
  border: '1px solid rgba(224, 224, 224, 1)',
  // width теперь будет вычисляться динамически
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
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { t } = useTranslation(['admin']);

  const maxColumnsPerPage = 10;
  const maxEmployeesPerColumn = 20;

  useEffect(() => {
    const loadServerData = async () => {
      try {
        setLoading(true);
        const { department } = await fetchDashboardList(currentPage);

        if (department && department.length > 0) {
          setDepartmentData(department);
          if (selectedDepartments.size === 0) {
            setSelectedDepartments(new Set(department.map(dept => dept.department_name)));
          }
        } else {
          setError("Нет данных для отображения.");
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setError("Ошибка при загрузке данных.");
      } finally {
        setLoading(false);
      }
    };

    loadServerData();
  }, [currentPage]);

  const filteredDepartmentData = useMemo(() => {
    return departmentData.filter(dept => selectedDepartments.has(dept.department_name));
  }, [departmentData, selectedDepartments]);

  const pages = useMemo(() => {
    const result: DepartmentData[][] = [];
    let currentPageDepts: DepartmentData[] = [];
    let currentCol = 0;

    filteredDepartmentData.forEach((dept) => {
        // Вычисляем, сколько колонок нужно для департамента
        const columnsNeeded = Math.ceil(dept.result.length / maxEmployeesPerColumn);
        
        // Если департамент не поместится в оставшиеся столбцы
        if (currentCol + columnsNeeded > maxColumnsPerPage) {
            // Сохраняем текущую страницу и начинаем новую
            if (currentPageDepts.length > 0) {
                result.push(currentPageDepts);
                currentPageDepts = [];
            }
            currentCol = 0;
        }

        // Распределяем сотрудников по столбцам
        let remainingEmployees = [...dept.result];
        while (remainingEmployees.length > 0) {
            const chunk = remainingEmployees.splice(0, maxEmployeesPerColumn);
            currentPageDepts.push({
                ...dept,
                result: chunk
            });
            currentCol++;
        }
    });

    // Добавляем последнюю страницу
    if (currentPageDepts.length > 0) {
        result.push(currentPageDepts);
    }

    return result;
}, [filteredDepartmentData]);


  const handleDepartmentToggle = (deptName: string) => {
    setSelectedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(deptName)) {
        newSet.delete(deptName);
      } else {
        newSet.add(deptName);
      }
      return newSet;
    });
    setCurrentPage(1);
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const renderDepartmentFilters = () => (
    <FormGroup>
      {departmentData.map((dept) => (
        <FormControlLabel
          key={dept.department_name}
          control={
            <Checkbox
              checked={selectedDepartments.has(dept.department_name)}
              onChange={() => handleDepartmentToggle(dept.department_name)}
              sx={{
                color: '#1976d2',
                '&.Mui-checked': {
                  color: '#1976d2',
                },
              }}
            />
          }
          label={`${dept.department_name} (${dept.display_number})`}
        />
      ))}
    </FormGroup>
  );

  const renderTableHead = () => {
    const currentData = pages[currentPage - 1] || [];
    const totalColumns = currentData.length < maxColumnsPerPage ? currentData.length : maxColumnsPerPage;
  
    return (
      <TableRow>
        {currentData.map((dept, index) => (
          <StyledTableCell 
            key={index} 
            sx={{ width: `${100 / totalColumns}%` }}
          >
            <strong>{dept.department_name}</strong>
          </StyledTableCell>
        ))}
        {currentPage === pages.length && currentData.length < maxColumnsPerPage && 
          Array.from({ length: maxColumnsPerPage - currentData.length }).map((_, emptyIndex) => (
            <StyledTableCell 
              key={`empty-header-${emptyIndex}`}
              sx={{ width: `${100 / maxColumnsPerPage}%` }}
            >
              <strong>-</strong>
            </StyledTableCell>
          ))
        }
      </TableRow>
    );
  };
  
  const renderTableContent = () => {
    const currentData = pages[currentPage - 1] || [];
    
    // Проверяем, является ли текущая страница последней
    const isLastPage = currentPage === pages.length;
  
    // Добавляем пустые столбцы только если:
    // 1. Это последняя страница И
    // 2. Количество столбцов на странице меньше maxColumnsPerPage
    const shouldAddEmptyColumns = isLastPage && currentData.length < maxColumnsPerPage;
    const totalColumns = shouldAddEmptyColumns ? maxColumnsPerPage : currentData.length;
    const columnWidth = `${100 / totalColumns}%`;
  
    return Array.from({ length: maxEmployeesPerColumn }, (_, rowIndex) => (
      <TableRow key={rowIndex}>
        {currentData.map((dept, colIndex) => {
          const employee = dept.result[rowIndex];
          return (
            <StyledTableCell key={`${colIndex}-${rowIndex}`} sx={{ width: columnWidth }}>
              {employee ? (
                <EmployeeCell status={employee.status}>{employee.full_name}</EmployeeCell>
              ) : (
                <EmployeeCell status={null}>-</EmployeeCell>
              )}
            </StyledTableCell>
          );
        })}
        {shouldAddEmptyColumns && 
          Array.from({ length: maxColumnsPerPage - currentData.length }).map((_, emptyIndex) => (
            <StyledTableCell key={`empty-${emptyIndex}`} sx={{ width: columnWidth }}>
              <EmployeeCell status={null}>-</EmployeeCell>
            </StyledTableCell>
          ))
        }
      </TableRow>
    ));
  };
  
  

  if (loading) return <div>...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2 }}>
        部門を選択
      </Button>
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            部門の選択
          </Typography>
          {renderDepartmentFilters()}
          <Button variant="contained" onClick={handleCloseModal} sx={{ mt: 2 }}>
            閉じる
          </Button>
        </Box>
      </Modal>
      <TableContainer component={Paper}>
        <Table>
<TableHead>
  <TableRow>
    {pages[currentPage - 1]?.map((dept, index) => (
      <StyledTableCell 
        key={index} 
        sx={{ width: `${100 / pages[currentPage - 1].length}%` }}
      >
        <strong>{dept.department_name}</strong>
      </StyledTableCell>
    ))}
    {currentPage === pages.length && pages[currentPage - 1]?.length < maxColumnsPerPage && 
      Array.from({ length: maxColumnsPerPage - (pages[currentPage - 1]?.length || 0) }).map((_, emptyIndex) => (
        <StyledTableCell 
          key={`empty-header-${emptyIndex}`}
          sx={{ width: `${100 / maxColumnsPerPage}%` }}
        >
          <strong>-</strong>
        </StyledTableCell>
      ))
    }
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
            戻る
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(pages.length, prev + 1))}
            disabled={currentPage === pages.length}
            endIcon={<NavigateNextIcon />}
          >
            次へ
          </Button>
        </ButtonGroup>
        <PageIndicator variant="h6">
          ページ {currentPage} / {pages.length}
        </PageIndicator>
      </PaginationContainer>
    </div>
  );
};

export default NewDepartmentTable;