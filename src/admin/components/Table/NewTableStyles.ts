// styles.ts
import { styled } from '@mui/material/styles';
import {
  TableCell,
  Box,
  Typography,
  ButtonGroup,
  Button,
  Checkbox,
} from '@mui/material';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  height: '60px',
  border: '1px solid rgba(224, 224, 224, 1)',
  fontSize: '20px',
}));

export const EmployeeCell = styled('div')<{ status: boolean | null }>(({ status, theme }) => ({
  backgroundColor: status === true ? '#e53935' : status === false ? '#e53935' : 'transparent',
  color: status === true ? '#000000' : status === false ? '#000000' : '#000000', // Цвет текста
  padding: theme.spacing(1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: '20px',
}));

export const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const PageIndicator = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
  padding: theme.spacing(2),
  color: '#105E82',
}));

export const StyledButtonGroup = styled(ButtonGroup)({
  '& .MuiButton-outlined': {
    borderColor: '#105E82',
    color: '#105E82',
    '&:hover': {
      backgroundColor: 'rgba(16, 94, 130, 0.04)',
      borderColor: '#105E82',
    },
    '&:disabled': {
      borderColor: 'rgba(16, 94, 130, 0.3)',
      color: 'rgba(16, 94, 130, 0.3)',
    },
  },
  // Убираем двойную рамку между кнопками
  '& .MuiButton-outlined:not(:last-child)': {
    borderRightColor: '#105E82',
  },
  // Убираем лишнюю рамку у средней кнопки с номером страницы
  '& .MuiButton-outlined:not(:first-child):not(:last-child)': {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    '&:hover': {
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
  },
});

export const StyledButton = styled(Button)({
  '&.MuiButton-outlined': {
    borderColor: '#105E82',
    color: '#105E82',
    '&:hover': {
      borderColor: '#105E82',
      backgroundColor: 'rgba(16, 94, 130, 0.04)',
    },
  },
});

export const StyledCheckbox = styled(Checkbox)({
  '&.MuiCheckbox-root': {
    color: '#105E82',
    '&.Mui-checked': {
      color: '#105E82',
    },
    '&.Mui-indeterminate': {
      color: '#105E82',
    },
  },
});
