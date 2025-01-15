import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { TableData } from './types';

interface CreateEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (newEmployee: TableData) => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({ open, onClose, onSave }) => {
  const [newEmployee, setNewEmployee] = useState<Partial<TableData>>({
    position: '',
    department: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name as string]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(newEmployee as TableData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
      }}>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Create New Employee
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            name="name"
            label="Name"
            value={newEmployee.full_name || ''}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel shrink={Boolean(newEmployee.department)}>Department</InputLabel>
            <Select
              name="department"
              value={newEmployee.department || ''}
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
            <InputLabel shrink={Boolean(newEmployee.position)}>Position</InputLabel>
            <Select
              name="Position"
              value={newEmployee.position || ''}
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
            fullWidth
            margin="normal"
            name="phone"
            label="Phone"
            value={newEmployee.phone || ''}
            onChange={handleInputChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            value={newEmployee.email || ''}
            onChange={handleInputChange}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateEmployeeModal;
