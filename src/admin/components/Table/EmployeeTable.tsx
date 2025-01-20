import React, { useState, useEffect } from "react";
import {
  Table,
  TableContainer,
  Paper,
  TablePagination,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { TableData, Column } from "./types.ts";
import AttendanceTableHead from "./AttendanceTableHead.tsx";
import AttendanceTableBody from "./AttendanceTableBody.tsx";
import axiosInstance from "../../../utils/libs/axios.ts";
import {deleteUser} from "../../../utils/libs/axios.ts";
import { useTranslation } from "react-i18next";

interface EmployeeTableProps {
  columns: Column[];
  onEdit?: (item: TableData) => void;
  onDelete?: (id: number) => void;
  tableTitle?: string;
  showCalendar?: boolean;
  positions: Position[];
  departments: Department[];
  userCreated: boolean;
}

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

interface FilterState {
  [key: string]: string[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  columns,
  onEdit,
  onDelete,
  tableTitle,
  showCalendar = true,
  positions,
  departments,
  userCreated
}) => {
  const [data, setData] = useState<TableData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<TableData[]>(data);
  const [pendingSearch, setPendingSearch] = useState("");
  const { t } = useTranslation('common');
  const [filters, setFilters] = useState<FilterState>({
    status: [],
    department: [],
    position: []
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axiosInstance().get("/user/list");
        
        const formattedData = response.data.data.results.map((item: any) => ({
          id: item.id,
          employee_id: item.employee_id,
          full_name: item.full_name,
          department: item.department,
          position: item.position,
          phone: item.phone,
          email: item.email,
          nick_name: item.nick_name,
        }));
        setData(formattedData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    fetchEmployeeData();
  }, [userCreated]);

  useEffect(() => {
    const filtered = data.filter((row) => {
      const matchesSearch = row.full_name
        ? row.full_name.toLowerCase().includes(searchTerm.toLowerCase())
        : false;

      const matchesFilters = Object.entries(filters).every(([key, values]) => {
        if (!values || values.length === 0) return true;
        const rowValue = row[key as keyof TableData];
        return rowValue ? values.includes(rowValue.toString()) : false;
      });

      return matchesSearch && matchesFilters;
    });

    setFilteredData(filtered);
    setPage(0);
  }, [data, searchTerm, filters]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPendingSearch(event.target.value);
  };

  const handleSearchSubmit = () => {
    setSearchTerm(pendingSearch);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleFilterChange = (columnId: string, value: string[]) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
  };

  // const handleCalendarOpen = () => {
  //   setCalendarOpen(true);
  // };

  // const handleCalendarClose = () => {
  //   setCalendarOpen(false);
  // };

  // Вычисляем данные для текущей страницы
  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    
    if (confirmDelete) {
      deleteUser(id)
        .then(() => {
          // Обновляем данные после удаления пользователя
          setData(data.filter((item) => item.id !== id));
        })
        .catch((error) => {
          console.error("Ошибка при удалении пользователя:", error);
        });
    }
  };
  
  



  return (
    <Paper sx={{ width: "100%", overflow: "hidden",           borderBottomLeftRadius: '10px',
    borderBottomRightRadius: '10px',
    borderTopLeftRadius: '0px',
    borderTopRightRadius: '0px', mb: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6">
          {tableTitle}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder={t('table.searchPlaceholder')}
            value={pendingSearch}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: "75%" }}
          />
          <Button
            onClick={handleSearchSubmit}
            variant="contained"
            sx={{ ml: 1, width: "20%", bgcolor: "#105E82", fontSize: "12px" }}
          >
            {t('table.searchBtn')}
          </Button>
        </Box>
      </Box>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <AttendanceTableHead
            columns={columns}
            filters={filters}
            onFilterChange={handleFilterChange}
            departments={departments}
            positions={positions}
          />
          <AttendanceTableBody
            columns={columns}
            filteredData={paginatedData}
            onEdit={onEdit}
            onDelete={handleDelete}
          />
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 30, 40, 50]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EmployeeTable;