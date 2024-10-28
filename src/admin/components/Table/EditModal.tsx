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
} from "@mui/material";
import { TableData } from "./types";
import { updateUser } from "../../../utils/libs/axios";

interface EditModalProps {
  open: boolean;
  data: TableData | null;
  onClose: () => void;
  onSave: (updatedData: TableData) => void;
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

const EditModal: React.FC<EditModalProps> = ({
  open,
  data,
  onClose,
  onSave,
  positions,
  departments,
}) => {
  const [formData, setFormData] = useState<TableData | null>(data);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      const { name, value } = e.target;
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
        await updateUser(
          formData.id,
          formData.password!,
          formData.role!,
          formData.full_name,
          departments.find((d) => d.name === formData.department)?.id!,
          positions.find((p) => p.name === formData.position)?.id!,
          formData.phone!,
          formData.email!
        );

        onSave(formData);
        onClose();
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  if (!formData) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          従業員の編集
        </Typography>
        <TextField
          label="氏名"
          name="full_name"
          value={formData.full_name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="パスワード"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel shrink={Boolean(formData.role)}>役職</InputLabel>
          <Select
            name="role"
            value={formData.role || ""}
            onChange={handleSelectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="Admin">管理者</MenuItem>
            <MenuItem value="Employee">従業員</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel shrink={Boolean(formData.department)}>
          部署
          </InputLabel>
          <Select
            name="department"
            value={formData.department || ""}
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
          <InputLabel shrink={Boolean(formData.position)}>役職</InputLabel>
          <Select
            name="position"
            value={formData.position || ""}
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
          label="電話番号"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="メールアドレス"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
        />

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>
            キャンセル
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            保存
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default EditModal;
