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

const customBreakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920,
    xxl: 2560,
  },
};

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  border: '1px solid rgba(224, 224, 224, 1)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  
  // 2560px и выше (огромные мониторы)
  [`@media (min-width: ${customBreakpoints.values.xxl}px)`]: {
    fontSize: '28px',
    padding: '8px',
    height: '60px',
    maxWidth: '120px',
  },
  
  // 1920px - 2559px (большие мониторы)
  [`@media (min-width: ${customBreakpoints.values.xl}px) and (max-width: ${customBreakpoints.values.xxl - 1}px)`]: {
    fontSize: '24px',
    padding: '7px',
    height: '55px',
    maxWidth: '110px',
  },
  
  // 1440px - 1919px (средние мониторы)
  [`@media (min-width: ${customBreakpoints.values.lg}px) and (max-width: ${customBreakpoints.values.xl - 1}px)`]: {
    fontSize: '16px',
    padding: '6px',
    height: '50px',
    maxWidth: '100px',
  },
  
  // 1024px - 1439px (маленькие мониторы/большие ноутбуки)
  [`@media (min-width: ${customBreakpoints.values.md}px) and (max-width: ${customBreakpoints.values.lg - 1}px)`]: {
    fontSize: '14px',
    padding: '5px',
    height: '45px',
    maxWidth: '90px',
  },
  
  // Меньше 1024px
  [`@media (max-width: ${customBreakpoints.values.md - 1}px)`]: {
    fontSize: '12px',
    padding: '4px',
    height: '40px',
    maxWidth: '80px',
  },
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
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  
  '& span': {
    display: 'block',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    transition: 'font-size 0.2s ease',

    // 2560px и выше
    [`@media (min-width: ${customBreakpoints.values.xxl}px)`]: {
      fontSize: '28px',
    },
    
    // 1920px - 2559px
    [`@media (min-width: ${customBreakpoints.values.xl}px) and (max-width: ${customBreakpoints.values.xxl - 1}px)`]: {
      fontSize: '20px',
    },
    
    // 1440px - 1919px
    [`@media (min-width: ${customBreakpoints.values.lg}px) and (max-width: ${customBreakpoints.values.xl - 1}px)`]: {
      fontSize: '16px',
    },
    
    // 1024px - 1439px
    [`@media (min-width: ${customBreakpoints.values.md}px) and (max-width: ${customBreakpoints.values.lg + 1}px)`]: {
      fontSize: '14px',
    },
    
    // Меньше 1024px
    [`@media (max-width: ${customBreakpoints.values.md + 1}px)`]: {
      fontSize: '12px',
    }
  }
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
  '& .MuiButton-outlined:not(:last-child)': {
    borderRightColor: '#105E82',
  },
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