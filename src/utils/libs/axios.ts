import axios from "axios";
import { Employee, Department, ApiResponse } from '../../admin/components/Table/types';


const axiosInstance = () => {
  const defaultOptions = {
    baseURL: "https://api.eduflow.uz/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let instance = axios.create(defaultOptions);

  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('access_token');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';

    // console.log('Токен:', token);
    // console.log('Данные запроса:', config.data);

    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refresh_token = localStorage.getItem('refresh_token');
        const access_token = refresh_token;
  
       
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return instance(originalRequest);
      }
      return Promise.reject(error);
    }
  );

  
  return instance;
};

export default axiosInstance;

export const fetchDepartments = async () => {
  try {
    const response = await axiosInstance().get('/department/list');

    console.log('Server response:', response.data); 

    if (response.data.status) {
      const departments = response.data.data.results;
      const nextDisplayNumber = response.data.data.displayNumber; 

      console.log('Departments:', departments); // Логируем список департаментов
      console.log('Next Display Number:', nextDisplayNumber); // Логируем следующее значение для display_number

      return { departments, nextDisplayNumber }; 
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error; 
  }
};



 export const fetchPositions = async () => {
  try {
    const response = await axiosInstance().get('/position/list');
    if (response.data.status) {
      const positions = response.data.data.results;
      // console.log('Fetched Positions:', positions);
      return positions;
    }
  } catch (error) {
    console.error('Error fetching positions:', error);
  }
};


export const createDepartment = async (name: string, display_number: number) => {
  const response = await axiosInstance().post('/department/create', { name, display_number });
  console.log('Create Department Response:', response.data);
  return response.data;
};

export const updateDepartment = async (id: number, name: string, display_number: number) => {
  const response = await axiosInstance().patch(`/department/${id}`, { name, display_number });
  console.log('Update Department Response:', response.data);
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await axiosInstance().delete(`/department/${id}`);
  return response.data;
};

export const createPosition = async (name: string, department_id: number) => {
  const response = await axiosInstance().post('/position/create', { name, department_id });
  return response.data;
};

export const updatePosition = async (id: number, name: string, department_id: number) => {
  const response = await axiosInstance().put(`/position/${id}`, { name, department_id });
  return response.data;
};

export const deletePosition = async (id: number) => {
  const response = await axiosInstance().delete(`/position/${id}`);
  return response.data;
};

export const createUser = async (password: string, role: string, full_name: string, department_id: number, position_id: number, phone: string, email: string) => {
  const response = await axiosInstance().post(`/user/create`, {password, role, full_name, department_id, position_id, phone, email});
  return response.data;
};

export const updateUser = async (id: number, password: string, role: string, full_name: string, department_id: number, position_id: number, phone: string, email: string) => {
  const response = await axiosInstance().patch(`/user/${id}`, {password, role, full_name, department_id, position_id, phone, email});
  return response.data;
};

export const deleteUser = async (id: number) => {
  const response = await axiosInstance().delete(`/user/${id}`);
  return response.data;
};


// Обновленная функция uploadExcelFile
export const uploadExcelFile = async (excell: FormData) => {
  try {
    excell.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    const response = await axiosInstance().post('user/create_excell', excell, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("Ответ сервера:", response.data);
    return response.data;
  } catch (error) {
    // Проверяем, является ли ошибка ошибкой axios, и выводим соответствующее сообщение
    if (axios.isAxiosError(error)) {
      console.error('Ошибка при загрузке файла:', error.response?.data || error.message);
    } else {
      console.error('Неизвестная ошибка:', error);
    }
    throw error;
  }
};

export const downloadSampleFile = async () => {
  try {
    const response = await axiosInstance().get('user/download_sample', {
      responseType: 'blob', // Важно для скачивания файлов
    });

    // Создаем blob из полученных данных
    const blob = new Blob([response.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });

    // Создаем ссылку для скачивания
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'sample.xlsx'); // Имя файла для скачивания
    
    // Добавляем ссылку в DOM и имитируем клик
    document.body.appendChild(link);
    link.click();
    
    // Очищаем
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка при скачивании sample файла:', error.response?.data || error.message);
    } else {
      console.error('Неизвестная ошибка:', error);
    }
    throw error;
  }
};


export const createByQRCode = async (employee_id: string, latitude: number, longitude: number) => {
  try {
    const response = await axiosInstance().post('/attendance/createbyqrcode', {
      employee_id,
      latitude,
      longitude
    });
    return response.data;
  } catch (error) {
    console.error('Error creating record by QR code:', error);
    throw error;
  }
};

export const fetchCompanySettings = async () => {
  try {
    const response = await axiosInstance().get('/company_info/list');
    if (response.data.status) {
      // console.log(response.data);
      return response.data.data;
    }
    throw new Error('Failed to fetch company settings');
  } catch (error) {
    console.error('Error fetching company settings:', error);
    throw error;
  }
};

export const updateCompanySettings = async (settings: FormData) => {
  try {
    const id = settings.get('id');
    if (!id) {
      throw new Error('Company ID is missing');
    }

    const response = await axiosInstance().put(`/company_info/${id}`, settings, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating company settings:', error);
    throw error;
  }
};

export const downloadEmployeeQRCode = async (employee_id: string) => {
  try {
    console.log(`Отправляем запрос для скачивания QR-кода сотрудника с employee_id: ${employee_id}`);
    
    const response = await axiosInstance().get(`/user/qrcode`, {
      params: { employee_id },
      responseType: 'blob',
    });
    
    console.log('Ответ получен:', response);
    
    if (response && response.status === 200 && response.data) {
      const blob = new Blob([response.data], { type: 'image/png' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `employee_${employee_id}_qrcode.png`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } else {
      throw new Error('Не удалось скачать QR-код, сервер вернул некорректный ответ.');
    }
  } catch (error) {
    console.error('Ошибка при скачивании QR-кода сотрудника:', error);
    if (axios.isAxiosError(error) && error.response) {
      console.error('Статус ответа:', error.response.status);
      console.error('Данные ответа:', error.response.data);
    }
    throw error;
  }
};


export const fetchQRCodeList = async (): Promise<Blob> => {
  const response = await axiosInstance().get('/user/qrcodelist', { responseType: 'blob' });

  // Log the size of the received PDF
  console.log("Размер полученного PDF:", response.data.size, "байт");

  return response.data; // Return the response.data, which will be of type Blob
};

// Функция для получения списка пользователей с эндпоинта `/user/dashboardlist`
export const fetchDashboardList = async (page: number): Promise<{
  employee_list: Employee[];
  total_employee_count: number;
  department: Department[];
}> => {
  try {
    const response = await axiosInstance().get<ApiResponse>('/user/dashboardlist', {
      params: { page }
    });

    console.log("Ответ API:", response.data);

    // Проверка структуры данных
    if (!response.data?.data?.results) {
      throw new Error("Не удалось получить данные. Пожалуйста, проверьте API.");
    }

    // Преобразование списка сотрудников
    const employee_list: Employee[] = response.data.data.results.flatMap(dept => 
      dept.result.map(emp => ({
        id: emp.id,
        employee_id: emp.employee_id,
        department_id: emp.department_id,
        department_name: emp.department_name,
        display_number: emp.display_number,
        full_name: emp.full_name,
        status: emp.status
      }))
    );

    // Преобразование списка департаментов
    const department: Department[] = response.data.data.results.map(dept => ({
      department_name: dept.department_name,
      display_number: dept.display_number,
      result: dept.result
    }));

    return {
      employee_list,
      total_employee_count: response.data.data.count,
      department,
    };
  } catch (error) {
    console.error('Error fetching dashboard list:', error);
    throw error;
  }
};






