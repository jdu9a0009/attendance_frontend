import React, { useState } from "react";
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
} from "@mui/material";
import { TableData } from "./types";
import { createUser } from "../../../utils/libs/axios"; // Импортируем функцию createUser
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

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  open,
  onClose,
  onSave,
  positions,
  departments,
}) => {
  const [newEmployee, setNewEmployee] = useState<Partial<TableData>>({
    position: "",
    department: "",
  });
  const { t } = useTranslation('admin');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name as string]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createdEmployee = await createUser(
        newEmployee.employee_id!,
        newEmployee.password!,
        newEmployee.role!,
        newEmployee.full_name!,
        departments.find((d) => d.name === newEmployee.department)?.id!,
        positions.find((p) => p.name === newEmployee.position)?.id!,
        newEmployee.phone!,
        newEmployee.email!
      );

      onSave(createdEmployee);
      onClose();
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        {t('createEmployeeModal.title')}
        </Typography>
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            name="full_name"
            label={t('createEmployeeModal.name')}
            value={newEmployee.full_name || ""}
            onChange={handleInputChange}
            autoComplete="off"
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="employee_id"
            label={t('createEmployeeModal.employeeId')}
            value={newEmployee.employee_id || ""}
            onChange={handleInputChange}
            autoComplete="off"
            required
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="password"
            label={t('createEmployeeModal.password')}
            type="password"
            value={newEmployee.password || ""}
            onChange={handleInputChange}
            autoComplete="new-password"
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel shrink={Boolean(newEmployee.role)}>{t('createEmployeeModal.role')}</InputLabel>
            <Select
              name="role"
              value={newEmployee.role || ""}
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Admin">{t('createEmployeeModal.roleAdmin')}</MenuItem>
              <MenuItem value="Employee">{t('createEmployeeModal.roleEmployee')}</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel shrink={Boolean(newEmployee.department)}>
            {t('createEmployeeModal.department')}
            </InputLabel>
            <Select
              name="department"
              value={newEmployee.department || ""}
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.name}>
                  {department.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel shrink={Boolean(newEmployee.position)}>{t('createEmployeeModal.position')}</InputLabel>
            <Select
              name="position"
              value={newEmployee.position || ""}
              onChange={handleSelectChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {positions.map((position) => (
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
            label={t('createEmployeeModal.phoneNumber')}
            value={newEmployee.phone || ""}
            onChange={handleInputChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label={t('createEmployeeModal.email')}
            value={newEmployee.email || ""}
            onChange={handleInputChange}
            required
          />
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
            {t('createEmployeeModal.cancelBtn')}
            </Button>
            <Button type="submit" variant="contained">
              {t('createEmployeeModal.saveBtn')}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateEmployeeModal;
