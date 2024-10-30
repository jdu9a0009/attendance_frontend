import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const primaryColor = '#105E82';

interface SideMenuProps {
  companyName: string;
}

// Стиль для списка меню
const CustomList = styled(List)({
  width: '100%',
  maxWidth: 240,
  backgroundColor: '#F5F8FA',
  padding: 0,
  borderRadius: '8px',
  overflow: 'hidden',
});

// Стиль для кнопок списка
const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: '12px 24px',
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: primaryColor,
    color: '#FFFFFF',
    '& .MuiListItemIcon-root': {
      color: '#FFFFFF', // Изменение цвета иконок при наведении
    },
  },
  '&.Mui-selected': {
    backgroundColor: primaryColor,
    color: '#FFFFFF',
    '& .MuiListItemIcon-root': {
      color: '#FFFFFF', // Изменение цвета иконок при выборе
    },
  },
}));

// Стиль для заголовка меню
const MenuTitle = styled(Typography)({
  padding: '16px 24px',
  color: primaryColor,
  fontWeight: 'bold',
});

function SideMenu({ companyName }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(['admin', 'common']);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    { path: '/admin', icon: <DashboardIcon />, text: t('admin:sideMenu.dashboard') },
    { path: '/admin/department-and-position', icon: <PeopleIcon />, text: t('admin:sideMenu.departmentAndPosition') },
    { path: '/admin/employee-edit', icon: <EditIcon />, text: t('admin:sideMenu.employeeEdit') },
    { path: '/admin/company-settings', icon: <SettingsIcon />, text: t('admin:sideMenu.companySettings') },
    { path: '/admin/new-table', icon: <TableChartIcon />, text: t('admin:sideMenu.newTable') },
  ];

  return (
    <CustomList>
      <MenuTitle variant="h6">{companyName || "Digital Knowledgee"}</MenuTitle>
      {menuItems.map((item, index) => (
        <React.Fragment key={item.path}>
          <ListItem disablePadding>
            <CustomListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>
                {React.cloneElement(item.icon, { style: { color: location.pathname === item.path ? '#FFFFFF' : primaryColor } })} {/* Устанавливаем цвет иконки */}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </CustomListItemButton>
          </ListItem>
          {index < menuItems.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </CustomList>
  );
}

export default SideMenu;
