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
    xxxl: 3840,
    cf: 2048, // these are curve fixes, for big jumps in resolution, so we can lower these big changes in jumps
    cf2: 3200,
    cf3: 3440,
  },
};

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textAlign: 'center',
  border: '1px solid rgba(224, 224, 224, 1)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  
  // 3840px и выше
  [`@media (min-width: ${customBreakpoints.values.xxxl}px)`]: {
    fontSize: '40px',
    padding: '10px',
    height: '100px',
    maxWidth: '140px',
  },

  // 3440px - 3839px
  [`@media (min-width: ${customBreakpoints.values.cf3}px) and (max-width: ${customBreakpoints.values.xxxl - 1}px)`]: {
    fontSize: '36px',
    padding: '9px',
    height: '90px',
    maxWidth: '130px',
  },

  // 3200px - 3439px
  [`@media (min-width: ${customBreakpoints.values.cf2}px) and (max-width: ${customBreakpoints.values.cf3 - 1}px)`]: {
    fontSize: '32px',
    padding: '9px',
    height: '80px',
    maxWidth: '130px',
  },

  // 2560px - 3199px
  [`@media (min-width: ${customBreakpoints.values.xxl}px) and (max-width: ${customBreakpoints.values.cf2 - 1}px)`]: {
    fontSize: '26px',
    padding: '8px',
    height: '60px',
    maxWidth: '120px',
  },
  
  // 1920px - 2559px (большие мониторы)
  [`@media (min-width: ${customBreakpoints.values.xl}px) and (max-width: ${customBreakpoints.values.xxl - 1}px)`]: {
    fontSize: '18px',
    padding: '7px',
    height: '55px',
    maxWidth: '110px',
  },
  
  // 1440px - 1919px (средние мониторы)
  [`@media (min-width: ${customBreakpoints.values.lg}px) and (max-width: ${customBreakpoints.values.xl - 1}px)`]: {
    fontSize: '13px',
    padding: '6px',
    height: '50px',
    maxWidth: '100px',
  },
  
  // 1024px - 1439px (маленькие мониторы/большие ноутбуки)
  [`@media (min-width: ${customBreakpoints.values.md}px) and (max-width: ${customBreakpoints.values.lg - 1}px)`]: {
    fontSize: '11px',
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

    // 3840px and so on
    [`@media (min-width: ${customBreakpoints.values.xxxl}px)`]: {
      fontSize: '34px'
    },
    // 2560px - 3840px
    [`@media (min-width: ${customBreakpoints.values.xxl}px) and (max-width: ${customBreakpoints.values.xxxl - 1}px)`]: {
      fontSize: '26px',
    },
    
    // 1920px - 2559px
    [`@media (min-width: ${customBreakpoints.values.xl}px) and (max-width: ${customBreakpoints.values.xxl - 1}px)`]: {
      fontSize: '18px',
    },
    
    // 1440px - 1919px
    [`@media (min-width: ${customBreakpoints.values.lg}px) and (max-width: ${customBreakpoints.values.xl - 1}px)`]: {
      fontSize: '13px',
    },
    
    // 1024px - 1439px
    [`@media (min-width: ${customBreakpoints.values.md}px) and (max-width: ${customBreakpoints.values.lg + 1}px)`]: {
      fontSize: '11px',
    },
    
    // Меньше 1024px
    [`@media (max-width: ${customBreakpoints.values.md + 1}px)`]: {
      fontSize: '9px',
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
  '& .MuiButton-outlined:not(:first-of-type):not(:last-child)': {
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