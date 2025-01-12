import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import Header from '../components/Header';
import MainContent from '../components/MainContent.tsx';
import '@fontsource/poppins/500.css';
import { Employee } from '../../employees.tsx';
import { Column } from '../../admin/components/Table/types.ts';

interface DashboardPageProps {
  employeeData: Employee | null;
  onLogout: () => void;
}

const columns: Column[] = [
  { id: 'id', label: 'ID' },
  { id: 'status', label: 'Status', filterable: true, filterValues: ['Present', 'Absent'] },
];

const DashboardPage: React.FC<DashboardPageProps> = ({ employeeData, onLogout }) => {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!employeeData) {
    return <div>Загрузка данных сотрудника...</div>;
  }

  if (!employeeData.id) {
    return <div>Данные сотрудника не найдены.</div>;
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabIndex(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container 
      maxWidth="xs" 
      sx={{ 
        background: '#f4f4f4',
        minHeight: '100vh',
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        p: 2,
        paddingBottom: '20px',
        pt: 4,
      }}
    >
      <Header
        onLogout={onLogout}
        anchorEl={anchorEl}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
      />
      <Box sx={{ flexGrow: 1 }}>
        <MainContent 
          tabIndex={tabIndex} 
          handleTabChange={handleTabChange}
          attendanceSummary={employeeData.attendanceSummary}
          employeeId={employeeData.id}
          username={employeeData.username} // Этот пропс можно удалить из MainContent, если он не используется
          tableColumns={columns}
        />
      </Box>
    </Container>
  );
};

export default DashboardPage;
