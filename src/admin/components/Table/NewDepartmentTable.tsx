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
import {
  StyledTableCell,
  EmployeeCell,
  PaginationContainer,
  PageIndicator,
  StyledButtonGroup,
  StyledButton,
  StyledCheckbox,
} from './NewTableStyles';
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
  last_name: string;
  nick_name?: string;
  status: boolean;
}

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
    if (employee.nick_name) {
      return employee.nick_name;
    }
    return employee.last_name ? employee.last_name.substring(0, 7) : '';
  };

  useEffect(() => {
    const eventSource = new EventSource('/api/user/dashboardlist'); // SSE endpoint

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data); // Parse server's message
      setDepartmentData((prev) => {
        const updatedData = [...prev];
        const index = updatedData.findIndex((dept) => dept.department_name === data.department_name);

        if (index >= 0) {
          // Update existing department
          updatedData[index] = data;
        } else {
          // Add new department
          updatedData.push(data);
        }

        return updatedData;
      });
    };

    eventSource.onerror = (err) => {
      console.error('SSE connection error:', err);
      setError('Connection lost. Trying to reconnect...');
    };

    return () => {
      eventSource.close(); // Cleanup SSE connection on unmount
    };
  }, []);

  const isAllSelected = useMemo(() => {
    return departmentData.length > 0 && selectedDepartments.size === departmentData.length;
  }, [departmentData, selectedDepartments]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedDepartments(new Set());
    } else {
      setSelectedDepartments(new Set(departmentData.map((dept) => dept.department_name)));
    }
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSelectedDepartments(new Set(departmentData.map((dept) => dept.department_name)));
    setCurrentPage(1);
  };

  const handleDepartmentToggle = (deptName: string) => {
    setSelectedDepartments((prev) => {
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
    return departmentData.filter((dept) => selectedDepartments.has(dept.department_name));
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
          result: chunk,
        });
        currentCol++;
      }
    });

    if (currentPageDepts.length > 0) {
      result.push(currentPageDepts);
    }

    return result;
  }, [filteredDepartmentData]);

  if (loading) return <div>...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* Rest of the component */}
    </div>
  );
};

export default NewDepartmentTable;
