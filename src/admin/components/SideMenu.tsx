import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings'; // Иконка для настроек
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  // Используем несколько пространств имен
  const { t } = useTranslation(['admin', 'common']);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          selected={location.pathname === '/admin'}
          onClick={() => handleNavigation('/admin')}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={t('admin:sideMenu.dashboard')} />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          selected={location.pathname === '/admin/department-and-position'}
          onClick={() => handleNavigation('/admin/department-and-position')}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary={t('admin:sideMenu.departmentAndPosition')} />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          selected={location.pathname === '/admin/employee-edit'}
          onClick={() => handleNavigation('/admin/employee-edit')}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary={t('admin:sideMenu.employeeEdit')} />
        </ListItemButton>
      </ListItem>
      <Divider />
      {/* Новый раздел для настроек компании */}
      <ListItem disablePadding>
        <ListItemButton
          selected={location.pathname === '/admin/company-settings'}
          onClick={() => handleNavigation('/admin/company-settings')}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary={t('admin:sideMenu.companySettings')} />
        </ListItemButton>
      </ListItem>
      <Divider />
    </List>
  );
};

export default SideMenu;
