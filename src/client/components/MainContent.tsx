import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { format } from 'date-fns';
import { ja, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import AttendanceSummary from './AttendanceSummary';
import TabsComponent from './TabsComponent';
<<<<<<< HEAD
import { Column } from './Table/types';
=======
import { Column } from '../../admin/components/Table/types';
>>>>>>> suhrob2
import axiosInstance from '../../utils/libs/axios';
import axios from 'axios';
import AttendanceTable from '../../admin/components/Table/AttendanceTable';

interface MainContentProps {
  tabIndex: number;
  handleTabChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
  attendanceSummary: {
    [key: string]: number;
  };
  employeeId: string;
  username: string; 
  tableColumns: Column[];
}

interface DashboardData {
  come_time: string;
  leave_time: string;
  total_hours: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
  department_id: number;
  department: string;
}

const MainContent: React.FC<MainContentProps> = ({
  tabIndex,
  handleTabChange,
  attendanceSummary,
  employeeId,
<<<<<<< HEAD
  tableColumns,
=======
  // tableColumns,
>>>>>>> suhrob2
}) => {
  const { t, i18n } = useTranslation(['common', 'user']);
  const [checkInTime, setCheckInTime] = useState<string>('--:--');
  const [checkOutTime, setCheckOutTime] = useState<string>('--:--');
  const [totalHours, setTotalHours] = useState<string>('--:--');
  const [message, setMessage] = useState<string | null>(null);
  const [messageColor, setMessageColor] = useState<string>('#000');
  const [currentTime, setCurrentTime] = useState<string>(format(new Date(), 'HH:mm:ss'));
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const columns: Column[] = [
    { id: 'employee_id', label: t('employeeId') },
    { id: 'full_name', label: t('fullName'), filterable: true },
    { id: 'status', label: t('status'), filterable: true, filterValues: [t('present'), t('absent')] },
  ] as Column[];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);

    fetchDashboardData();

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: string): string => {
    return time && time !== '--:--' ? time.slice(0, 5) : time;
  };


  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance().get<{ data: DashboardData, status: boolean }>('/user/dashboard');
      console.log('DashboardResponse:', response);

      if (response.data.status) {
        const { come_time, leave_time, total_hours } = response.data.data;

        setCheckInTime(formatTime(come_time) || '--:--');
        setCheckOutTime(formatTime(leave_time) || '--:--');
        setTotalHours(total_hours || '--:--');
      }
    } catch (error) {
      console.error('Ошибка при получении данных дашборда:', error);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация не поддерживается вашим браузером'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('Получены координаты:', position.coords.latitude, position.coords.longitude);
            resolve(position);
          },
          (error) => {
            console.error('Ошибка получения геолокации:', error);
            reject(new Error('Ошибка получения геолокации. Убедитесь, что разрешения установлены и попробуйте снова.'));
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      }
    });
  };

  const sendComeData = async () => {
    try {
      const position = await getCurrentPosition();
      const data = {
        employee_id: employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const token = localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      console.log('Отправляемые данные:', data);
      console.log('URL запроса:', '/attendance/createbyphone');
      console.log('Токен авторизации:', token ? 'Присутствует' : 'Отсутствует');
      console.log('Заголовки запроса:', headers);

      const response = await axiosInstance().post('/attendance/createbyphone', data);

      console.log(`Ответ сервера (checkIn):`, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Ошибка при отправке данных checkIn:`, error.response?.data || error.message);
      } else {
        console.error(`Неизвестная ошибка при отправке данных checkIn:`, error);
      }
      throw error;
    }
  };

  const sendLeaveData = async () => {
    try {
      const position = await getCurrentPosition();
      const data = {
        employee_id: employeeId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      const token = localStorage.getItem('access_token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      console.log('Отправляемые данные:', data);
      console.log('URL запроса:', '/attendance/exitbyphone');
      console.log('Токен авторизации:', token ? 'Присутствует' : 'Отсутствует');
      console.log('Заголовки запроса:', headers);

      const response = await axiosInstance().patch('/attendance/exitbyphone', data);

      console.log(`Ответ сервера (checkOut):`, response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Ошибка при отправке данных checkOut:`, error.response?.data || error.message);
      } else {
        console.error(`Неизвестная ошибка при отправке данных checkOut:`, error);
      }
      throw error;
    }
  };

  const handleComeClick = async () => {
    try {
      const result = await sendComeData();
      if (result && result.status) {
        setCheckInTime(formatTime(result.data.come_time));
        setMessage(`仕事へようこそ！出勤した時間 ${formatTime(result.data.come_time)}`);
        setMessageColor('#000');
      } else {
        setMessage(result.error || 'Произошла ошибка при отметке прихода.');
        setMessageColor('#ff0000');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса на отметку прихода:', error);
      if (axios.isAxiosError(error) && error.response) {
        setMessage(error.response.data.error || 'Произошла ошибка при отметке прихода.');
      } else {
        setMessage('Произошла неизвестная ошибка при отметке прихода.');
      }
      setMessageColor('#ff0000');
    }
  };
  
  const handleLeaveClick = async () => {
    if (checkInTime !== '--:--') {
      try {
        const result = await sendLeaveData();
        if (result && result.status) {
          setCheckOutTime(formatTime(result.data.leave_time));
          setTotalHours(result.data.total_hours);
          setMessage(`退勤した時間 ${formatTime(result.data.leave_time)}`);
          setMessageColor('#000');
        } else {
          setMessage(result.error || 'Произошла ошибка при отметке выхода.');
          setMessageColor('#ff0000');
        }
      } catch (error) {
        console.error('Ошибка при отправке запроса на отметку выхода:', error);
        if (axios.isAxiosError(error) && error.response) {
          setMessage(error.response.data.error || 'Произошла ошибка при отметке выхода.');
        } else {
          setMessage('Произошла неизвестная ошибка при отметке выхода.');
        }
        setMessageColor('#ff0000');
      }
    } else {
      setMessage('まず、出勤してください。');
      setMessageColor('#ff0000');
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: 'white',
        borderRadius: 4,
        boxShadow: 3,
        p: 3,
        overflow: 'hidden',
        textAlign: 'center',
        position: 'relative',
        padding: 1,
      }}
    >
      <TabsComponent tabIndex={tabIndex} handleTabChange={handleTabChange} />

      {tabIndex === 0 && (
        <>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1c1f26' }}>
            {currentTime}
          </Typography>
          <Typography variant="h6" color="#666666" sx={{ fontSize: '0.70rem' }}>
            {format(new Date(), i18n.language === 'ja' ? 'yyyy年MM月dd日 (EEEE)' : 'MMMM d, yyyy (EEEE)', { locale: i18n.language === 'ja' ? ja : enUS })}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {checkInTime}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
                {t('user:checkInTime')}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#d6d6d6' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {checkOutTime}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
                {t('user:checkOutTime')}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#d6d6d6' }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ color: '#1c1f26' }}>
                {totalHours}
              </Typography>
              <Typography variant="body2" color="#666666" sx={{ mt: 1 }}>
                {t('user:totalWorkHours')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleComeClick}
              sx={{
                borderRadius: 28,
                mb: '12px',
                backgroundColor: '#1cbeca',
                '&:hover': {
                  backgroundColor: '#1a9bde',
                },
              }}
            >
              {t('user:checkIn')}
            </Button>
            <Button
              variant="contained"
              onClick={handleLeaveClick}
              sx={{
                borderRadius: 28,
                mb: '12px',
                backgroundColor: '#ff9500',
                '&:hover': {
                  backgroundColor: '#e88e00',
                },
              }}
            >
              {t('user:checkOut')}
            </Button>
          </Box>
          {message && (
            <Typography variant="body1" align="center" sx={{ mt: 2, color: messageColor }}>
              {message}
            </Typography>
          )}
        </>
      )}

      {tabIndex === 1 && <AttendanceSummary attendanceSummary={attendanceSummary}/>}

      {tabIndex === 2 && (
        <Box sx={{ overflowX: 'auto' }}>
          <AttendanceTable columns={columns} showCalendar={false} tableTitle={t('common:table.title')} departments={departments}
            positions={positions}/>
        </Box>
      )}
    </Box>
  );
};

export default MainContent;