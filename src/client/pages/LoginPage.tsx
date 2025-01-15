import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  useTheme,
  Link,
  CircularProgress,
} from '@mui/material';
import axiosInstance from '../../utils/libs/axios';
import axios, { AxiosError } from 'axios';
import { Employee } from '../../employees';

interface LoginPageProps {
  onLoginSuccess: (employee: Employee) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [employee_id, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!employee_id || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Попытка входа с ID:', employee_id);
      const response = await axiosInstance().post("/sign-in", {
        employee_id: employee_id,
        password: password,
      });

      console.log('Ответ от сервера:', response);

      if (response.data && response.data.data && response.data.data.access_token) {
        const accessToken = response.data.data.access_token;
        const refreshToken = response.data.data.refresh_token;
        
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        // console.log('Токены сохранены в localStorage:', { accessToken, refreshToken });

        const tempEmployeeData: Employee = {
          id: employee_id,
          username: response.data.employee_id || 'Unknown',
          password: '',
          role: response.data.data.role || 'employee',
          position: response.data.position || 'Unknown',
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

        // console.log('Сохранение данных сотрудника в localStorage:', tempEmployeeData);
        localStorage.setItem("employeeData", JSON.stringify(tempEmployeeData));
        onLoginSuccess(tempEmployeeData);
        
        // Обновленная логика перенаправления
        console.log('Перенаправление на основе роли:', tempEmployeeData.role);
        if (tempEmployeeData.role === 'ADMIN') {
          navigate("/admin");
        } else if (tempEmployeeData.role === 'QRCODE') {
          navigate("/qrscanner");
        } else if (tempEmployeeData.role === 'DASHBOARD') {
          navigate("/bigTable");
        } else {
          navigate("/employee");
        }
      } else {
        console.error('Токены отсутствуют в ответе');
        setError('Неверный ответ от сервера');
      }
    } catch (err) {
      console.error('Ошибка при входе:', err);
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        console.error("Детали ошибки:", axiosError);
        console.error("Статус ответа:", axiosError.response?.status);
        console.error("Данные ответа:", axiosError.response?.data);
        
        if (axiosError.response) {
          const errorMessage = typeof axiosError.response.data === 'object' && axiosError.response.data !== null
            ? (axiosError.response.data as { message?: string }).message || 'Неизвестная ошибка'
            : 'Неизвестная ошибка';
          setError(`Ошибка ${axiosError.response.status}: ${errorMessage}`);
        } else if (axiosError.request) {
          setError('Нет ответа от сервера. Проверьте подключение к интернету.');
        } else {
          setError(`Ошибка: ${axiosError.message}`);
        }
      } else {
        console.error("Неизвестная ошибка:", err);
        setError("Произошла неизвестная ошибка");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          borderRadius: 4,
          boxShadow: 3,
          backgroundColor: '#f0f8ff',
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography component="h1" variant="h5">
        ログイン
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="employee_id"
            label="社員ID"
            name="employee_id"
            autoComplete="employee_id"
            autoFocus
            value={employee_id}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="パスワード"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading}
            sx={{
              mt: 3,
              mb: 2,
              backgroundColor: theme.palette.success.light,
              '&:hover': {
                backgroundColor: theme.palette.success.dark,
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : 'ログイン'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;