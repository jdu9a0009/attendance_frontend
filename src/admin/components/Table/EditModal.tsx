import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { TableData } from "./types";
import { updateUser } from "../../../utils/libs/axios";
import { useTranslation } from "react-i18next";

interface EditModalProps {
  open: boolean;
  data: TableData | null;
  onClose: () => void;
  onSave: (updatedData: TableData) => void;
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

const EditModal: React.FC<EditModalProps> = ({
  open,
  data,
  onClose,
  onSave,
  positions,
  departments,
  userCreated
}) => {
  const [formData, setFormData] = useState<TableData | null>(null);
  const [nickNameError, setNickNameError] = useState<string>("");
  const { t } = useTranslation('admin');

  // Update formData when the data prop changes or modal opens
  useEffect(() => {
    if (open && data) {
      // Deep copy to avoid direct mutation of the original data
      setFormData({
        ...data,
        password: '', // Clear password field when opening
      });
    }
  }, [open, data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
      
      if (name === 'nick_name') {
        if (value.length > 7) {
          setNickNameError("ニックネームは7文字以内で入力してください");
          return;
        }
        setNickNameError("");
      }

      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    if (formData) {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name as string]: value,
      });
    }
  };

  const handleSave = async () => {
    if (formData) {
      try {
        
        const departmentId = departments.find((d) => d.name === formData.department)?.id;
        const positionId = positions.find((p) => p.name === formData.position)?.id;

        
        if (!departmentId || !positionId) {
          console.error("Department or Position not found");
          return;
        }

        await updateUser(
          formData.id,
          formData.employee_id,
          formData.password || '', 
          formData.role!,
          formData.last_name!,
          departmentId,
          positionId,
          formData.phone!,
          formData.email!,
          formData.nick_name || '' 
        );
        
        onSave(formData);
        onClose();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  // If modal is not open or no data, return null
  if (!open || !formData) return null;

  const theme = createTheme({
    palette: {
      primary: {
        main: '#105E82',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t('createEmployeeModal.title')}
          </Typography>
          <TextField
            label={t('createEmployeeModal.employeeId')}
            name="employee_id"
            value={formData.employee_id}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t('createEmployeeModal.firstName')}
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t('createEmployeeModal.lastName')}
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t('createEmployeeModal.password')}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            autoComplete="off"
          />
          <TextField
            label={t('createEmployeeModal.nickName') || "Nickname"}
            name="nick_name"
            value={formData.nick_name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={Boolean(nickNameError)}
            helperText={nickNameError}
            inputProps={{ maxLength: 7 }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel shrink={Boolean(formData.role)}>{t('createEmployeeModal.role')}</InputLabel>
            <Select
              name="role"
              value={formData.role}
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
            <InputLabel shrink={Boolean(formData.department)}>
              {t('createEmployeeModal.department')}
            </InputLabel>
            <Select
              name="department"
              value={formData.department}
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
            <InputLabel shrink={Boolean(formData.position)}>{t('createEmployeeModal.position')}</InputLabel>
            <Select
              name="position"
              value={formData.position}
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
            label={t('createEmployeeModal.phoneNumber')}
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label={t('createEmployeeModal.email')}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            required
          />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>
              {t('createEmployeeModal.cancelBtn')}
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              {t('createEmployeeModal.saveBtn')}
            </Button>
          </Box>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

const modalStyle = {
  position: "absolute" as "absolute",
  borderRadius: "10px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default EditModal;