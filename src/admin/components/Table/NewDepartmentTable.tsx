import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  FormGroup,
  FormControlLabel,
  Modal,
  Stack,
  Divider,
  Tooltip
} from '@mui/material';
import { setupDashboardSSE } from '../../../utils/libs/axios.ts';
import {
  StyledTableCell,
  EmployeeCell,
  PaginationContainer,
  PageIndicator,
  StyledButtonGroup,
  StyledButton,
  StyledCheckbox,
} from './NewTableStyles.ts';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Department } from './types.ts';
import '../../../shared/styles/App.css'

interface DepartmentData {
  department_name: string;
  department_nickname?: string;
  display_number: number;
  result: EmployeeData[];
}

interface EmployeeData {
  id: number;
  employee_id: string;
  department_id: number;
  department_name: string;
  department_nickname?: string;
  display_number: number;
  last_name: string;
  nick_name?: string;
  status: boolean;
}

interface Colors {
  new_absent_color: string;
  new_present_color: string;
}

const NewDepartmentTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [colors, setColors] = useState<Colors>({
    new_absent_color: '#e53935',
    new_present_color: '#fafafa'
  });

  const maxColumnsPerPage = 10;
  const maxEmployeesPerColumn = 20;

  const formatName = (employee: EmployeeData): string => {
    const name = employee.nick_name || employee.last_name || "";
    return name.length > 7 ? `${name.substring(0, 7)}..` : name;
  };
  
  const formatDepartmentName = (department: DepartmentData): string => {
    const name = department.department_nickname || department.department_name || "";
    return name.length > 7 ? `${name.substring(0, 7)}..` : name;
  };

  useEffect(() => {
    const handleSSEMessage = (data: { 
      department: Department[], 
      colors?: Colors 
    }) => {
      const { department, colors: newColors } = data;
  
      if (department && department.length > 0) {
        setDepartmentData(department);
        if (selectedDepartments.size === 0) {
          setSelectedDepartments(new Set(department.map(dept => dept.department_name)));
        }
      } else {
        setError("Нет данных для отображения.");
      }
  
      if (newColors) {
        setColors({
          new_absent_color: newColors.new_absent_color || colors.new_absent_color,
          new_present_color: newColors.new_present_color || colors.new_present_color
        });
      }
  
      setLoading(false);
    };
  
    const handleSSEError = (error: Error) => {
      console.error("Ошибка SSE:", error);
      setError("Ошибка при загрузке данных.");
      setLoading(false);
    };
  
    const closeSSE = setupDashboardSSE(handleSSEMessage, handleSSEError);
  
    return () => closeSSE();
  }, [colors.new_absent_color, colors.new_present_color, selectedDepartments.size]);

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
              {employee && employee.employee_id !== null ? (
                <EmployeeCell 
                  status={employee.status}
                  colors={colors}
                >
                  <span>{formatName(employee)}</span>
                </EmployeeCell>
              ) : (
                <EmployeeCell 
                  status={null}
                  colors={colors}
                >
                  -
                </EmployeeCell>
              )}
            </StyledTableCell>
          );
        })}
        {isLastPage && currentData.length < maxColumnsPerPage &&
          Array.from({ length: maxColumnsPerPage - currentData.length }).map((_, emptyIndex) => (
            <StyledTableCell key={`empty-${emptyIndex}`} sx={{ width: columnWidth }}>
              <EmployeeCell 
                status={null}
                colors={colors}
              >
                -
              </EmployeeCell>
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
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
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
                label={`${formatDepartmentName(dept)} (${dept.display_number})`}
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
                <Tooltip 
                  key={index} 
                  title={dept.department_name}
                  arrow 
                  className="custom-tooltip"
                >
                  <StyledTableCell>
                    <strong>{formatDepartmentName(dept)}</strong>
                  </StyledTableCell>
                </Tooltip>
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
          <TableBody>
            {renderTableContent()}
          </TableBody>
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