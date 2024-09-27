import React from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Box
} from '@mui/material';
import { Department } from '../pages/DepartmentPositionManagement';
import { deleteDepartment } from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: number) => void;
}

function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  const handleDelete = async (id: number) => {
    await deleteDepartment(id);
    onDelete(id);
  };
  const { t } = useTranslation('admin');

  return (
    <Paper sx={{  borderRadius: 4, boxShadow: 2, mb: 5}}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('departmentTable.departmentName')}</TableCell>
            <TableCell>{t('departmentTable.action')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((department) => (
            <TableRow key={department.id}>
              <TableCell>{department.name}</TableCell>
              <TableCell>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={() => onEdit(department)} variant="outlined" size='small'>{t('departmentTable.editBtn')}</Button>
                <Button onClick={() => handleDelete(department.id)} variant="outlined" size='small' color="error">{t('departmentTable.deleteBtn')}</Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default DepartmentTable;
