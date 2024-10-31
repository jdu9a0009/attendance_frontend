import React from "react";
import { TableBody, TableRow, TableCell, Box, Button } from "@mui/material";
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
    return key === 'checkOut' ? '' : '--:--';
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
  return value.toString();
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
  const { t } = useTranslation('admin');

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
                          downloadEmployeeQRCode(row.employee_id);
                        } else {
                          console.error("Employee ID is missing");
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
                {column.id === 'status' && typeof value === 'boolean' ? (
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
                    }}
                  >
                    {formatValue(value, column.id)}
                  </Box>
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
