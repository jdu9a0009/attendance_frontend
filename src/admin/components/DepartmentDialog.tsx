import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button,
} from '@mui/material';
import { Department } from '../pages/DepartmentPositionManagement'; 
import { createDepartment, updateDepartment } from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';

interface DepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  department: Department | null;
  onSave: (department: Department) => void;
}



function DepartmentDialog({ open, onClose, department, onSave }: DepartmentDialogProps) {
  const [name, setName] = useState(department?.name || '');
  const { t } = useTranslation('admin');

  const handleSave = async () => {
    if (name === department?.name) {
      alert('using same names');
    } else if (name.trim() !== '') {
      let savedDepartment;
      if (department) {
        await updateDepartment(department.id, name);
        savedDepartment = { id: department.id, name };
      } else {
        const response = await createDepartment(name);
        savedDepartment = { id: response.data.id, name: response.data.name };
      }
      onSave(savedDepartment);
      onClose();
    } else {
      
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{department ? t('departmentTable.dialogTitleEdit') : t('departmentTable.dialogTitleAdd')}</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t('departmentTable.label')}
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DepartmentDialog;
