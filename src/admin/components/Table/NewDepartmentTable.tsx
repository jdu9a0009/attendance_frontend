import React, { useState, useEffect, useMemo, useRef } from 'react';
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
import io from 'socket.io-client';
import {
  StyledTableCell,
  EmployeeCell,
  PaginationContainer,
  PageIndicator,
  StyledButtonGroup,
  StyledButton,
  StyledCheckbox,
} from './NewTableStyles';

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
  last_name: string;
  nick_name?: string;
  status: boolean;
}

interface WebSocketResponse {
  data: DepartmentData[];
}

const SOCKET_URL = 'ws://localhost:8080/api/v1/user/dashboardlist/ws'

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

  const formatName = (employee: EmployeeData): string => {
    if (!employee.last_name) {
      return employee.nick_name || ''; 
    }

    if (employee.last_name.length > 7) {
      return employee.nick_name || employee.last_name.substring(0, 7);
    }

    return employee.last_name;
  };

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const maxReconnectAttempts = 5; // Увеличил количество попыток
  const reconnectAttemptRef = useRef<number>(0);
  const pingIntervalRef = useRef<NodeJS.Timeout>();

  const initializeWebSocket = () => {
    if (!wsRef.current) return;

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      setLoading(true);
      setError(null);
      reconnectAttemptRef.current = 0;
      
      // Отправляем инициализирующее сообщение
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: 'subscribe',
          data: {
            type: 'dashboard'
          }
        }));
      }
    };

    wsRef.current.onmessage = (event: MessageEvent) => {
      console.group('WebSocket Message Received');
      console.log('Raw message data:', event.data);
      
      try {
        const fullResponse = JSON.parse(event.data);
        console.log("Parsed response:", fullResponse);

        // Проверяем тип сообщения
        if (fullResponse.type === 'pong') {
          console.log('Received pong response');
          return;
        }

        const data = fullResponse.data;
        console.log("Extracted data:", data);
        console.groupEnd();

        if (data && data.length > 0) {
          setDepartmentData(data);
          if (selectedDepartments.size === 0) {
            setSelectedDepartments(new Set(data.map((dept: DepartmentData) => dept.department_name)));
          }
          setError(null);
        } else {
          setError('Нет данных для отображения.');
        }
      } catch (parseError) {
        console.error('Data parsing error:', parseError);
        console.log('Received data that could not be parsed:', event.data);
        setError('Ошибка при обработке данных.');
      } finally {
        setLoading(false);
      }
    };

    wsRef.current.onerror = (event: Event) => {
      console.group('WebSocket Error');
      console.error('WebSocket error:', event);
      console.groupEnd();
      setError('Ошибка подключения к серверу.');
      setLoading(false);
    };

    wsRef.current.onclose = (event: CloseEvent) => {
      console.group('WebSocket Closed');
      console.log('Close code:', event.code);
      console.log('Close reason:', event.reason);
      console.log('Was clean close:', event.wasClean);
      console.groupEnd();
      
      if (!event.wasClean) {
        console.warn('Abnormal WebSocket closure detected');
        reconnectWebSocket();
      }
    };
  };

  const reconnectWebSocket = () => {
    if (reconnectAttemptRef.current >= maxReconnectAttempts) {
      setError('Превышено максимальное количество попыток подключения');
      return;
    }

    const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptRef.current), 10000);
    console.log(`Attempting to reconnect in ${timeout}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptRef.current += 1;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      connectWebSocket();
    }, timeout);
  };

  const connectWebSocket = () => {
    try {
      console.log('Attempting to connect to WebSocket URL:', SOCKET_URL);

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      wsRef.current = new WebSocket(SOCKET_URL);
      initializeWebSocket();

      // Установка периодического ping
      pingIntervalRef.current = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            action: 'ping',
            data: {
              timestamp: Date.now()
            }
          }));
        }
      }, 30000);

    } catch (error) {
      console.error('WebSocket initialization error:', error);
      setError('Ошибка при создании соединения');
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      reconnectAttemptRef.current = 0;
    };
  }, []);


  const isAllSelected = useMemo(() => {
    return departmentData.length > 0 && selectedDepartments.size === departmentData.length;
  }, [departmentData, selectedDepartments]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDepartments(new Set());
    } else {
      setSelectedDepartments(new Set(departmentData.map((dept: DepartmentData) => dept.department_name)));
    }
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedDepartments(new Set(departmentData.map((dept: DepartmentData) => dept.department_name)));
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
    return departmentData.filter((dept: DepartmentData) => selectedDepartments.has(dept.department_name));
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
                <EmployeeCell status={employee.status}>
                  {formatName(employee)}
                </EmployeeCell>
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
