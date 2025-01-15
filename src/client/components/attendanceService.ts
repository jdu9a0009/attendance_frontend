import axios from 'axios';

const API_BASE_URL_MONTHLY = 'https://attendance-backend-24xu.onrender.com/api/v1/user/monthly';
const API_BASE_URL_WEEKLY = 'https://attendance-backend-24xu.onrender.com/api/v1/user/statistics';

// Функция для получения данных для карточек (ежемесячная статистика)
export const getMonthlyAttendanceData = async (year: number, month: number) => {
  try {
    const monthFormatted = `${year}-${String(month).padStart(2, '0')}-01`;
    const token = localStorage.getItem('access_token');

    console.log('Отправляемые данные (Monthly):', { month: monthFormatted, token });
    console.log('URL запроса (Monthly):', API_BASE_URL_MONTHLY);
    console.log('Токен авторизации (Monthly):', token ? 'Присутствует' : 'Отсутствует');

    const response = await axios.get(API_BASE_URL_MONTHLY, {
      params: { month: monthFormatted },
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log('Ответ сервера (Monthly):', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке данных (Monthly):', error);
    if (axios.isAxiosError(error)) {
      console.error('Детали ошибки Axios (Monthly):', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
    throw error;
  }
};
  

// Функция для получения данных для недельной статистики
export const getWeeklyTimesheetData = async (year: number, month: number, interval: number = 0) => {
  try {
    const monthFormatted = `${year}-${String(month).padStart(2, '0')}-01`;
    const token = localStorage.getItem('access_token');

    console.log('Отправляемые данные (Weekly):', { month: monthFormatted, interval });
    console.log('URL запроса (Weekly):', 'https://attendance-backend-24xu.onrender.com/api/v1/user/statistics');
    console.log('Токен авторизации (Weekly):', token ? 'Присутствует' : 'Отсутствует');

    const response = await axios.get('https://attendance-backend-24xu.onrender.com/api/v1/user/statistics', {
      params: {
        month: monthFormatted,
        interval: interval,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Ответ сервера (Weekly):', response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при отправке данных (Weekly):', error);
    if (axios.isAxiosError(error)) {
      console.error('Детали ошибки Axios (Weekly):', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
};
  
