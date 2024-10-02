import React, { useState } from "react";
import { TableBody, TableRow, TableCell, Box, Select, MenuItem, SelectChangeEvent, Button } from "@mui/material";
import { TableData, Column, DateOrString } from "./types";
import { useTranslation } from 'react-i18next';
import { downloadEmployeeQRCode } from '../../../utils/libs/axios';

interface AttendanceTableBodyProps {
  columns: Column[];
  filteredData: TableData[];
  onEdit?: (item: TableData) => void;
  onDelete?: (id: number) => void;
}




const formatValue = (value: DateOrString | boolean, key?: string): string => {
  if (value === undefined || value === null) {
    // Special condition for checkOut to return "--:--"
    if (key === 'checkOut') {
      return '';
    }
    return '--:--';
  }
  if (typeof value === 'boolean') {
    return value ? 'Present' : 'Absent';
  }
  if (value instanceof Date) {
    if (key === 'date') {
      return value.toISOString().split('T')[0];
    } else if (key === 'checkIn' || key === 'checkOut') {
      return value.toTimeString().split(' ')[0];
    }
    return value.toLocaleString();
  }
  if (typeof value === 'number') {
    return value.toString();
  }
  return value;
};

const getStatusStyles = (status: boolean): { backgroundColor: string; color: string } => {
  return status
    ? { backgroundColor: '#e6effc', color: '#0764e6' }
    : { backgroundColor: '#ffe5ee', color: '#aa0000' };
};

const AttendanceTableBody: React.FC<AttendanceTableBodyProps> = ({ 
  columns, 
  filteredData, 
  onEdit, 
  onDelete 
}) => {
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const { t } = useTranslation('admin');

  const handleStatusChange = (rowId: number, newStatus: string) => {
    // Реализация обработки изменения статуса
    setEditingRowId(null);
  };

  const handleDownloadQRCode = async (employeeId: string) => {
    try {
      await downloadEmployeeQRCode(employeeId);
      console.log(`QR-код для сотрудника ${employeeId} успешно скачан`);
    } catch (error) {
      console.error(`Ошибка при скачивании QR-кода для сотрудника ${employeeId}:`, error);
      // Здесь вы можете добавить отображение ошибки для пользователя, например, через snackbar или alert
    }
  };

  return (
    <TableBody>
      {filteredData.map((row) => (
        <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
          {columns.map((column) => {
            if (column.id === 'action') {
              return (
<TableCell key={column.id} sx={{ padding: '8px 16px' }}>
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    {onEdit && (
      <Button onClick={() => onEdit(row)} variant="outlined" size="small">
        {t('employeeTable.editBtn')}
      </Button>
    )}
    {onDelete && (
      <Button
        variant="outlined"
        size="small"
        color="error"
        onClick={() => onDelete(row.id)}
      >
        {t('employeeTable.deleteBtn')}
      </Button>
    )}
                    <Button
                      variant="outlined"
                      size="small"
                      color="primary"
                      onClick={() => {
                        if (row.employee_id) {
                          handleDownloadQRCode(row.employee_id);
                        } else {
                          console.error("ID сотрудника отсутствует");
                        }
                      }}
                    >
                      {t('employeeTable.downloadQRCodeBtn')}
                    </Button>

  </Box>
</TableCell>

              );
            }

            const value = row[column.id as keyof TableData];
            const { backgroundColor, color } = column.id === 'status' && typeof value === 'boolean'
              ? getStatusStyles(value as boolean)
              : { backgroundColor: '#fff', color: '#000' };

            return (
              <TableCell key={`${row.id}-${column.id}`} sx={{ padding: '8px 16px' }}>

                {column.id === 'status' && value !== undefined ? (
                  editingRowId === row.id ? (
                    <Select
                      value={value.toString()} // Convert boolean to string for the select value
                      onChange={(e: SelectChangeEvent<string>) => handleStatusChange(row.id, e.target.value)}
                      displayEmpty
                      sx={{
                        backgroundColor,
                        color,
                        px: 1,
                        borderRadius: 1,
                        minWidth: 120,
                        height: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {[
                        { label: 'Present', value: 'true' },
                        { label: 'Absent', value: 'false' },
                      ].map(({ label, value }) => (
                        <MenuItem key={value} value={value}>{label}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor,
                        color,
                        borderRadius: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 36,
                        minWidth: 100,
                        cursor: 'pointer'
                      }}
                      onClick={() => setEditingRowId(row.id)}
                    >
                      {formatValue(value, column.id)}
                    </Box>
                  )
                ) : (
                  formatValue(value, column.id)
                )}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
};

export default AttendanceTableBody;