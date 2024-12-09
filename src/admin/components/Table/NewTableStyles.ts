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
  fontSize: '28px',
}));

export const EmployeeCell = styled('div')<{ 
  status: boolean | null, 
  colors?: { 
    new_absent_color: string; 
    new_present_color: string; 
  } 
}>(({ status, theme, colors }) => ({
  backgroundColor: 
    status === true 
      ? colors?.new_present_color || '#fafafa' 
      : status === false 
        ? colors?.new_absent_color || '#026db0' 
        : 'transparent', 
  color: '#000000',
  padding: theme.spacing(1),
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: '28px', // Базовый размер шрифта
  // Уменьшение шрифта при переполнении
  '& span': {
    display: 'block',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: 'clamp(18px, 2.5vw, 28px)', // Минимальный шрифт 18px, максимальный 28px
  },
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