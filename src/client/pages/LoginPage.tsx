import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  useTheme,
  CircularProgress,
} from '@mui/material';
import axiosInstance from '../../utils/libs/axios.ts';
import { Employee } from '../../employees.tsx';
import { AxiosError } from '../../admin/components/Table/types.ts';



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
      setError('すべての欄にご記入ください。');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance().post("/sign-in", {
        employee_id: employee_id,
        password: password,
      });


      if (response.data && response.data.data && response.data.data.access_token) {
        const accessToken = response.data.data.access_token;
        const refreshToken = response.data.data.refresh_token;
        
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

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

        localStorage.setItem("employeeData", JSON.stringify(tempEmployeeData));
        onLoginSuccess(tempEmployeeData);
        
        if (tempEmployeeData.role === 'ADMIN') {
          navigate("/admin");
        } else if (tempEmployeeData.role === 'QRCODE') {
          navigate("/qrscanner");
        } else if (tempEmployeeData.role === 'DASHBOARD') {
          navigate("/bigTable");
        } else {
          navigate("/employee");
        }
      } 
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        setError(axiosError.response.data.error);
      } else {
        setError('予期せぬエラーが発生しました');
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
            label="社員番号 & メールアドレス"
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
          
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          
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