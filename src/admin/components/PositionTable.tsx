import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow, Paper, Button, Box, Snackbar, Alert
} from '@mui/material';
import { Position, Department } from '../pages/DepartmentPositionManagement.tsx'; 
import { deletePosition } from '../../utils/libs/axios.ts';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';

interface PositionTableProps {
  positions: Position[];
  onEdit: (position: Position) => void;
  onDelete: (positionId: number) => void;
  departments: Department[];
}

function PositionTable({ positions, onEdit, onDelete, departments }: PositionTableProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deletePosition(id);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting position:', error);
      if (error instanceof AxiosError && error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const { t } = useTranslation('admin');

  const getDepartmentName = (departmentId: number) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  };

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

      <Paper sx={{ borderRadius: 4, boxShadow: 2, mb: 5}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('positionTable.jobTitle')}</TableCell>
              <TableCell>{t('positionTable.positionName')}</TableCell>
              <TableCell>{t('positionTable.action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => (
              <TableRow key={position.id}>
                <TableCell>{position.name}</TableCell>
                <TableCell>{getDepartmentName(position.department_id)}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      onClick={() => onEdit(position)} 
                      variant="outlined" 
                      size='small'
                    >
                      {t('positionTable.editBtn')}
                    </Button>
                    <Button 
                      onClick={() => handleDelete(position.id)} 
                      variant="outlined" 
                      size='small' 
                      color="error"
                    >
                      {t('positionTable.deleteBtn')}
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

export default PositionTable;