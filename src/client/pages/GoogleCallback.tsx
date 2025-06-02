import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CircularProgress, Container, Typography, Box } from '@mui/material';
import { Employee } from '../../employees.tsx';

interface GoogleCallbackProps {
  onLoginSuccess: (employee: Employee) => void;
}

const GoogleCallback: React.FC<GoogleCallbackProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    const role = searchParams.get('role');
    const error = searchParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      navigate('/login?error=google_auth_failed');
      return;
    }

    if (access_token && refresh_token && role) {
      // Сохраняем токены
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Создаем объект Employee
      const tempEmployeeData: Employee = {
        id: 'google_user', // Можно использовать данные из JWT токена
        username: 'Google User', // Можно декодировать из JWT
        password: '',
        role: role.toUpperCase() as "ADMIN" | "EMPLOYEE" | "QRCODE" | "DASHBOARD", // EMPLOYEE -> EMPLOYEE
        position: 'Unknown',
        checkInTime: null,
        checkOutTime: null,
        location: 'Unknown',
        status: 'Absent',
        attendanceSummary: {
          earlyLeaves: 0,
          absences: 0,
          lateIns: 0,
          leaves: 0,
        },
      };

      localStorage.setItem("employeeData", JSON.stringify(tempEmployeeData));
      onLoginSuccess(tempEmployeeData);

      // Перенаправляем в зависимости от роли
      if (role.toUpperCase() === 'ADMIN') {
        navigate("/admin");
      } else if (role.toUpperCase() === 'QRCODE') {
        navigate("/qrscanner");
      } else if (role.toUpperCase() === 'DASHBOARD') {
        navigate("/bigTable");
      } else {
        navigate("/employee");
      }
    } else {
      // Если нет нужных параметров, перенаправляем на login
      navigate('/login?error=missing_tokens');
    }
  }, [searchParams, navigate, onLoginSuccess]);

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box style={{ textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Googleアカウントでログイン中...
        </Typography>
      </Box>
    </Container>
  );
};

export default GoogleCallback;