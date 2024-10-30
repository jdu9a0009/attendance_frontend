import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Box, Alert, Snackbar
} from '@mui/material';
import { Department } from '../pages/DepartmentPositionManagement';
import { deleteDepartment } from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios'

interface DepartmentTableProps {
  departments: Department[];
  onEdit: (department: Department) => void;
  onDelete: (departmentId: number) => void;
}

function DepartmentTable({ departments, onEdit, onDelete }: DepartmentTableProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteDepartment(id);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting department:', error);
      if (error instanceof AxiosError && error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error instanceof Error) {
        setError(error.message);
      }
    }
  };
  const { t } = useTranslation('admin');

  return (
    <>
<Box
  sx={{
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
  }}
>
  <Snackbar
    open={!!error}
    autoHideDuration={6000}
    onClose={() => setError(null)}
    sx={{ position: 'static', transform: 'none' }}
  >
    <Alert
      onClose={() => setError(null)}
      severity="error"
      sx={{
        width: '100%',
        minWidth: '300px',
        boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
        padding: '16px', // Увеличиваем отступы
        fontSize: '1.2rem', // Увеличиваем размер шрифта
      }}
    >
      {error}
    </Alert>
  </Snackbar>
</Box>



    <Paper sx={{ borderRadius: 4, boxShadow: 2, mb: 5 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('departmentTable.departmentName')}</TableCell>
            <TableCell>{t('departmentTable.displayNumber')}</TableCell> {/* Новый заголовок для display_number */}
            <TableCell>{t('departmentTable.action')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments
            .sort((a, b) => a.display_number - b.display_number) // Сортировка по display_number
            .map((department) => (
              <TableRow key={department.id}>
                <TableCell>{department.name}</TableCell>
                <TableCell>{department.display_number}</TableCell> {/* Отображение display_number */}
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={() => onEdit(department)} variant="outlined" size="small">
                      {t('departmentTable.editBtn')}
                    </Button>
                    <Button onClick={() => handleDelete(department.id)} variant="outlined" size="small" color="error">
                      {t('departmentTable.deleteBtn')}
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Paper>
    </>
  );
}

export default DepartmentTable;