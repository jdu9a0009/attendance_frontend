import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { TableData } from './types';

interface EditModalProps {
  open: boolean;
  data: TableData | null;
  onClose: () => void;
  onSave: (updatedData: TableData) => void;
}

const EditModal: React.FC<EditModalProps> = ({ open, data, onClose, onSave }) => {
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

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Edit Employee</Typography>
        <TextField
          label="Name"
          name="name"
          value={formData.full_name}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel shrink={Boolean(formData.department)}>Department</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleSelectChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Engineering">Engineering</MenuItem>
            <MenuItem value="Sales">Sales</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel shrink={Boolean(formData.position)}>Role</InputLabel>
          <Select
            name="position"
            value={formData.position}
            onChange={handleSelectChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Developer">Developer</MenuItem>
            <MenuItem value="Designer">Designer</MenuItem>
            <MenuItem value="Salesperson">Salesperson</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Save</Button>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default EditModal;
