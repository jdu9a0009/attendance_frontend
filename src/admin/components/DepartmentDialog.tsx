import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem, Select } from '@mui/material';
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
        // Найти департамент с таким же display_number, если он существует
        const conflictingDepartment = departments.find(dep => dep.display_number === displayNumber && dep.id !== department.id);

        if (conflictingDepartment) {
          // Если есть конфликтующий департамент, свапаем их display_number
          const oldDisplayNumber = department.display_number;

          // Обновляем конфликтующий департамент, присваивая ему старый display_number
          await updateDepartment(conflictingDepartment.id, conflictingDepartment.name, oldDisplayNumber);

          // Обновляем текущий департамент с новым display_number
          await updateDepartment(department.id, name, displayNumber);

          // Передаем обновленный текущий департамент в onSave
          savedDepartment = { id: department.id, name, display_number: displayNumber };
          onSave(savedDepartment);
        } else {
          // Если конфликтующего департамента нет, просто обновляем текущий департамент
          await updateDepartment(department.id, name, displayNumber);
          savedDepartment = { id: department.id, name, display_number: displayNumber };
          onSave(savedDepartment);
        }
      } else {
        // Для нового департамента используем nextDisplayNumber
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
        <Select
          fullWidth
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
            >
              {dep.display_number}
            </MenuItem>
          ))}
          {!department && (
            <MenuItem value={nextDisplayNumber}>
              {nextDisplayNumber}
            </MenuItem>
          )}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DepartmentDialog;
