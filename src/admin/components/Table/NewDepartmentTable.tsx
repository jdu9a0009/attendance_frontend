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
  Stack,
  Divider,
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
  fontSize: '28px',
}));

const EmployeeCell = styled('div')<{ status: boolean | null }>(({ status, theme }) => ({
  backgroundColor: status === true ? '#43A047' : status === false ? '#E53935' : 'transparent',
  padding: theme.spacing(1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '28px',
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const PageIndicator = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  padding: theme.spacing(2),
  color: '#105E82',
}));

const StyledButtonGroup = styled(ButtonGroup)({
  '& .MuiButton-outlined': {
    borderColor: '#105E82',
    color: '#105E82',
    '&:hover': {
      backgroundColor: 'rgba(16, 94, 130, 0.04)',
      borderColor: '#105E82',
    },
    '&:disabled': {
      borderColor: 'rgba(16, 94, 130, 0.3)',
      color: 'rgba(16, 94, 130, 0.3)',
    },
  },
  // Убираем двойную рамку между кнопками
  '& .MuiButton-outlined:not(:last-child)': {
    borderRightColor: '#105E82',
  },
  // Убираем лишнюю рамку у средней кнопки с номером страницы
  '& .MuiButton-outlined:not(:first-child):not(:last-child)': {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    '&:hover': {
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
  },
});

const StyledButton = styled(Button)({
  '&.MuiButton-outlined': {
    borderColor: '#105E82',
    color: '#105E82',
    '&:hover': {
      borderColor: '#105E82',
      backgroundColor: 'rgba(16, 94, 130, 0.04)',
    },
  },
});

const StyledCheckbox = styled(Checkbox)({
  '&.MuiCheckbox-root': {
    color: '#105E82',
    '&.Mui-checked': {
      color: '#105E82',
    },
    '&.Mui-indeterminate': {
      color: '#105E82',
    },
  },
});

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

  const isAllSelected = useMemo(() => {
    return departmentData.length > 0 && selectedDepartments.size === departmentData.length;
  }, [departmentData, selectedDepartments]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDepartments(new Set());
    } else {
      setSelectedDepartments(new Set(departmentData.map(dept => dept.department_name)));
    }
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedDepartments(new Set(departmentData.map(dept => dept.department_name)));
    setCurrentPage(1);
  };

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

  const filteredDepartmentData = useMemo(() => {
    return departmentData.filter(dept => selectedDepartments.has(dept.department_name));
  }, [departmentData, selectedDepartments]);

  const pages = useMemo(() => {
    const result: DepartmentData[][] = [];
    let currentPageDepts: DepartmentData[] = [];
    let currentCol = 0;

    filteredDepartmentData.forEach((dept) => {
      const columnsNeeded = Math.ceil(dept.result.length / maxEmployeesPerColumn);

      if (currentCol + columnsNeeded > maxColumnsPerPage) {
        if (currentPageDepts.length > 0) {
          result.push(currentPageDepts);
          currentPageDepts = [];
        }
        currentCol = 0;
      }

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

    if (currentPageDepts.length > 0) {
      result.push(currentPageDepts);
    }

    return result;
  }, [filteredDepartmentData]);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const renderTableContent = () => {
    const currentData = pages[currentPage - 1] || [];
    const isLastPage = currentPage === pages.length;
    const totalColumns = isLastPage && currentData.length < maxColumnsPerPage ? maxColumnsPerPage : currentData.length;
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
        {isLastPage && currentData.length < maxColumnsPerPage &&
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
      <Button 
        variant="contained" 
        onClick={handleOpenModal} 
        sx={{ 
          mb: 2,
          backgroundColor: '#105E82',
          '&:hover': {
            backgroundColor: '#0D4D6B',
          },
        }}
      >
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
          <FormGroup>
            <FormControlLabel
              control={
                <StyledCheckbox
                  checked={isAllSelected}
                  indeterminate={selectedDepartments.size > 0 && !isAllSelected}
                  onChange={handleSelectAll}
                />
              }
              label="All"
            />
            <Divider sx={{ my: 1 }} />
            {departmentData.map((dept) => (
              <FormControlLabel
                key={dept.department_name}
                control={
                  <StyledCheckbox
                    checked={selectedDepartments.has(dept.department_name)}
                    onChange={() => handleDepartmentToggle(dept.department_name)}
                  />
                }
                label={`${dept.department_name} (${dept.display_number})`}
              />
            ))}
          </FormGroup>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <StyledButton 
              variant="outlined" 
              onClick={handleReset}
              sx={{ flex: 1 }}
            >
              Reset
            </StyledButton>
            <Button 
              variant="contained" 
              onClick={handleCloseModal}
              sx={{ 
                flex: 1,
                backgroundColor: '#105E82',
                '&:hover': {
                  backgroundColor: '#0D4D6B',
                },
              }}
            >
              閉じる
            </Button>
          </Stack>
        </Box>
      </Modal>
      <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: 'hidden' }}>
  <Table>
    <TableHead>
      <TableRow>
        {pages[currentPage - 1]?.map((dept, index) => (
          <StyledTableCell key={index}>
            <strong>{dept.department_name}</strong>
          </StyledTableCell>
        ))}
        {currentPage === pages.length && pages[currentPage - 1]?.length < maxColumnsPerPage && 
          Array.from({ length: maxColumnsPerPage - (pages[currentPage - 1]?.length || 0) }).map((_, emptyIndex) => (
            <StyledTableCell key={`empty-header-${emptyIndex}`}>
              <strong>-</strong>
            </StyledTableCell>
          ))
        }
      </TableRow>
    </TableHead>
    <TableBody>{renderTableContent()}</TableBody>
  </Table>
</TableContainer>

      <PaginationContainer>
        <StyledButtonGroup variant="outlined" size="large">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <NavigateBeforeIcon />
          </Button>
          <Button disabled sx={{ pointerEvents: 'none' }}>
            <PageIndicator>
              {currentPage} / {pages.length}
            </PageIndicator>
          </Button>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(pages.length, prev + 1))}
            disabled={currentPage === pages.length}
          >
            <NavigateNextIcon />
          </Button>
        </StyledButtonGroup>
      </PaginationContainer>
    </div>
  );
};

export default NewDepartmentTable;