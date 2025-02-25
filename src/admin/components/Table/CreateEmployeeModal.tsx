import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { AxiosError, TableData } from "./types.ts";
import { createUser } from "../../../utils/libs/axios.ts";
import { useTranslation } from "react-i18next";

interface CreateEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newEmployee: TableData) => void;
  positions: Position[];
  departments: Department[];
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

const initialEmployeeState = {
  position: "",
  department: "",
  role: "",
  employee_id: "",
  first_name: "",
  last_name: "",
  password: "",
  nick_name: "",
  phone: "",
  email: "",
};

const theme = createTheme({
  palette: {
    primary: {
      main: "#105E82",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  open,
  onClose,
  onSave,
  positions = [],
  departments = [],
}) => {
  const [newEmployee, setNewEmployee] = useState<Partial<TableData>>({
    position: "",
    department: "",
    role: "",
  });
  const [nickNameError, setNickNameError] = useState<string>("");
  const [error, setError] = useState("");
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const { t } = useTranslation("admin");

  useEffect(() => {
    if (!open) {
      setNewEmployee(initialEmployeeState);
      setError("");
      setNickNameError("");
      setFilteredPositions([]);
    }
  }, [open]);

  useEffect(() => {
    if (newEmployee.department) {
      const selectedDepartment = departments.find(
        (dept) => dept.name === newEmployee.department
      );
      
      if (selectedDepartment) {
        const positionsForDepartment = positions.filter(
          (position) => position.department_id === selectedDepartment.id
        );
        setFilteredPositions(positionsForDepartment);
        
        if (!positionsForDepartment.some(p => p.name === newEmployee.position)) {
          setNewEmployee(prev => ({ ...prev, position: "" }));
        }
      }
    } else {
      setFilteredPositions([]);
      setNewEmployee(prev => ({ ...prev, position: "" }));
    }
  }, [newEmployee.department, newEmployee.position, departments, positions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (open) {
      setError(""); 
    }

    if (name === "nick_name") {
      if (value.length > 7) {
        setNickNameError(
          t("createEmployeeModal.nickNameError") ||
            "Nickname cannot be longer than 7 characters"
        );
        return;
      }
      setNickNameError("");
    }

    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    if (name === "department") {
      setNewEmployee({ 
        ...newEmployee, 
        [name]: value,
        position: "" 
      });
    } else {
      setNewEmployee({ ...newEmployee, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const createdEmployee = await createUser(
        newEmployee.password!,
        newEmployee.employee_id!,
        newEmployee.role!,
        newEmployee.first_name!,
        newEmployee.last_name!,
        departments.find((d) => d.name === newEmployee.department)?.id!,
        positions.find((p) => p.name === newEmployee.position)?.id!,
        newEmployee.phone!,
        newEmployee.email!,
        newEmployee.nick_name
      );
      onSave(createdEmployee);
      onClose();
      setNewEmployee(initialEmployeeState);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        setError(axiosError.response.data.error);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            borderRadius: "10px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {t("createEmployeeModal.title")}
          </Typography>
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextField
              fullWidth
              margin="normal"
              name="employee_id"
              label={t("createEmployeeModal.employeeId")}
              value={newEmployee.employee_id}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <TextField
              fullWidth
              margin="dense"
              name="last_name"
              label={t("createEmployeeModal.lastName")}
              value={newEmployee.last_name}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <TextField
              fullWidth
              margin="normal" 
              name="first_name"
              label={t("createEmployeeModal.firstName")}
              value={newEmployee.first_name}
              onChange={handleInputChange}
              autoComplete="off"
              required
            />
            <TextField
              required
              fullWidth
              margin="dense" 
              name="password"
              label={t("createEmployeeModal.password")}
              type="password"
              value={newEmployee.password}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
            <TextField
              fullWidth
              margin="normal" 
              name="nick_name"
              label={t("createEmployeeModal.nickName") || "Nickname"}
              value={newEmployee.nick_name || ""}
              onChange={handleInputChange}
              error={Boolean(nickNameError)}
              helperText={nickNameError}
              inputProps={{ maxLength: 7 }}
            />
            <FormControl fullWidth margin="dense" required>
              <InputLabel shrink={Boolean(newEmployee.role)}>
                {t("createEmployeeModal.role")}
              </InputLabel>
              <Select
                name="role"
                value={newEmployee.role}
                onChange={handleSelectChange}
              >
                <MenuItem value="Admin">
                  {t("createEmployeeModal.roleAdmin")}
                </MenuItem>
                <MenuItem value="Employee">
                  {t("createEmployeeModal.roleEmployee")}
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal" required>
              <InputLabel shrink={Boolean(newEmployee.department)}>
                {t("createEmployeeModal.department")}
              </InputLabel>
              <Select
                name="department"
                value={newEmployee.department}
                onChange={handleSelectChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {departments?.map((department) => (
                  <MenuItem key={department.id} value={department.name}>
                    {department.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="dense" required>
              <InputLabel shrink={Boolean(newEmployee.position)}>
                {t("createEmployeeModal.position")}
              </InputLabel>
              <Select
                name="position"
                value={newEmployee.position}
                onChange={handleSelectChange}
                disabled={!newEmployee.department} 
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {filteredPositions.map((position) => (
                  <MenuItem key={position.id} value={position.name}>
                    {position.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              margin="normal" 
              name="phone"
              label={t("createEmployeeModal.phoneNumber")}
              value={newEmployee.phone}
              onChange={handleInputChange}
            />
            <TextField
              fullWidth
              margin="dense" 
              name="email"
              label={t("createEmployeeModal.email")}
              value={newEmployee.email}
              onChange={handleInputChange}
              required
            />
            <Typography variant="body2" color="error">
              {error}
            </Typography>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={onClose} sx={{ mr: 1 }}>
                {t("createEmployeeModal.cancelBtn")}
              </Button>
              <Button type="submit" variant="contained">
                {t("createEmployeeModal.saveBtn")}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default CreateEmployeeModal;