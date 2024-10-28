import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Department } from '../pages/DepartmentPositionManagement';
import { createDepartment, updateDepartment } from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';

interface DepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  department: Department | null;
  onSave: (department: Department) => void;
  departments: Department[]; // Передаём departments для работы с display_number
  nextDisplayNumber: number; // Передаём nextDisplayNumber
  onDisplayNumberChange: (number: number) => void;
}

function DepartmentDialog({ open, onClose, department, onSave, departments, nextDisplayNumber, onDisplayNumberChange }: DepartmentDialogProps) {
  const [name, setName] = useState(department?.name || '');
  const [displayNumber, setDisplayNumber] = useState<number>(department?.display_number || 0); // Управляемый display_number
  const { t } = useTranslation('admin');

  useEffect(() => {
    if (department) {
      setName(department.name);
      setDisplayNumber(department.display_number);
    }
  }, [department]);

  const handleSave = async () => {
    if (name.trim() !== '') {
      let savedDepartment;

      if (department) {
        const conflictingDepartment = departments.find(dep => dep.display_number === displayNumber && dep.id !== department.id);

        if (conflictingDepartment) {
          const oldDisplayNumber = department.display_number;

          await updateDepartment(conflictingDepartment.id, conflictingDepartment.name, oldDisplayNumber);
          await updateDepartment(department.id, name, displayNumber);

          savedDepartment = { id: department.id, name, display_number: displayNumber };
          onSave(savedDepartment);
        } else {
          await updateDepartment(department.id, name, displayNumber);
          savedDepartment = { id: department.id, name, display_number: displayNumber };
          onSave(savedDepartment);
        }
      } else {
        const response = await createDepartment(name, displayNumber);
        savedDepartment = { 
          id: response.data.id, 
          name: response.data.name, 
          display_number: displayNumber 
        };
        onSave(savedDepartment);
      }

      onClose();
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

        {/* Dropdown для выбора display_number */}
        <FormControl fullWidth margin="dense">
          <InputLabel>{t('')}</InputLabel>
          <Select
  value={displayNumber}
  onChange={(e) => {
    setDisplayNumber(Number(e.target.value));
    onDisplayNumberChange(Number(e.target.value));
  }}
>
  {departments.map(dep => (
    <MenuItem 
      key={dep.id} 
      value={dep.display_number}
      sx={{ opacity: dep.id !== department?.id ? 0.5 : 1 }} // Затемняем занятые номера, если это не текущий департамент
    >
      {`${dep.display_number} (${dep.name})`} {/* Новый формат отображения */}
    </MenuItem>
  ))}
  {!department && (
    <MenuItem value={nextDisplayNumber}>
      {nextDisplayNumber} {/* Используем следующий номер отображения без изменений */}
    </MenuItem>
  )}
</Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DepartmentDialog;
