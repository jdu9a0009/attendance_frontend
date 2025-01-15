import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Typography, TextField, Button, Box, IconButton } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parse, isValid } from 'date-fns';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { LatLngTuple } from 'leaflet';
import MapComponent from '../components/MapComponent'; 
import axiosInstance, { fetchCompanySettings, updateCompanySettings } from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';

interface CompanySettings {
  id?: number;
  company_name: string;
  logo: File | null;
  start_time: Date | null;
  end_time: Date | null;
  late_time: number;
  over_start_time: Date | null;
  over_end_time: Date | null;
  company_coordinates: LatLngTuple;
  company_location: string;
}

const CompanySettings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    id: undefined,
    company_name: '',
    logo: null,
    start_time: null,
    end_time: null,
    late_time: 15,
    over_start_time: null,
    over_end_time: null,
    company_location: '',
    company_coordinates: [35.6762, 139.6503], // Tokyo Default
  });

  const isValidFileType = (file: File): boolean => {
    const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return acceptedTypes.includes(file.type);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && isValidFileType(file)) {
      handleChange('logo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      // Показать сообщение об ошибке пользователю
      alert('Пожалуйста, выберите файл формата JPG, JPEG или PNG');
      // Сбросить значение input
      e.target.value = '';
    }
  };

  const [editMode, setEditMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const { t } = useTranslation('admin');
  const parseTimeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchCompanySettings();
        const results = data?.results;
        console.log('Received data from API:', data);
  
        if (results) {
          setSettings(prevSettings => ({
            ...prevSettings,
            id: results.id,
            company_name: results.company_name || '',
            logo: results.logo || null,
            start_time: results.start_time ? parseTime(results.start_time) : null,
            end_time: results.end_time ? parseTime(results.end_time) : null,
            late_time: results.late_time ? parseTimeToMinutes(results.late_time) : prevSettings.late_time,
            over_start_time: results.end_time ? parseTime(results.end_time) : null,
            over_end_time: results.over_end_time ? parseTime(results.over_end_time) : null,
            company_coordinates: [parseFloat(results.latitude), parseFloat(results.longitude)] as LatLngTuple,
            company_location: `${results.latitude}, ${results.longitude}`,
          }));
  
          if (results.logo) {
            const imageUrl = results.logo.startsWith('http') 
              ? results.logo 
              : `${process.env.REACT_APP_API_BASE_URL}/${results.logo}`;
            setLogoPreview(imageUrl);
          }
        }
      } catch (error) {
        console.error('Failed to load company settings:', error);
      }
    };
  
    loadSettings();
  }, []);
  
  

  const handleChange = (field: keyof CompanySettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (field === 'logo' && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    }
  };

  const handleSaveAll = async () => {
    const formData = new FormData();
    Object.entries(settings).forEach(([key, value]) => {
      if (key === 'company_coordinates') {
        // Send latitude and longitude as numbers
        const [latitude, longitude] = (value as LatLngTuple);
        formData.append('latitude', latitude.toString());
        formData.append('longitude', longitude.toString());
      } else if (key === 'company_location' || key === 'over_start_time') {
        // Skip company_location and over_start_time
        return;
      } else if (value instanceof Date) {
        // Format all time fields as HH:mm:ss
        formData.append(key, format(value, 'HH:mm:ss'));
      } else if (key === 'late_time') {
        // Format late_time as HH:mm:ss
        const hours = Math.floor(value / 60);
        const minutes = value % 60;
        formData.append(key, `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`);
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });
  
    console.log('Sending data to API:', Object.fromEntries(formData));
  
    try {
      const response = await updateCompanySettings(formData);
      console.log('Settings saved successfully:', response);
      setEditMode(false);
      // You can add a success message for the user here
    } catch (error) {
      console.error('Failed to save settings:', error);
      // You can add an error message for the user here
    }
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  
  

  const parseTime = (timeString: string | null): Date | null => {
    if (!timeString) return null;
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0);
    return date;
  };
  

  const handlePositionChange = useCallback((newPosition: LatLngTuple) => {
    setSettings(prev => ({
      ...prev,
      company_coordinates: newPosition,
      company_location: `${newPosition[0].toFixed(6)}, ${newPosition[1].toFixed(6)}`,
    }));
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      handleSaveAll();
    } else {
      setEditMode(true);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 3, position: 'relative' }}>
      {/* Заголовок и кнопка редактирования */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {t('settings.mainTitle')}
        </Typography>
        <IconButton onClick={handleEditToggle} color="primary">
          {editMode ? <SaveIcon /> : <EditIcon />}
        </IconButton>
      </Box>
  
      {/* Блок с названием компании и логотипом */}
      <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t('settings.chapter1Title')}
        </Typography>
        <TextField
          label={t('settings.companyNameLabel')}
          value={settings.company_name}
          onChange={(e) => handleChange('company_name', e.target.value)}
          fullWidth
          margin="normal"
          disabled={!editMode}
        />
  
        {/* Логотип компании */}
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {t('settings.logo')}
          </Typography>
          <input
      accept="image/jpeg,image/jpg,image/png"
      style={{ display: 'none' }}
      id="logo-upload"
      type="file"
      onChange={handleLogoChange}
      disabled={!editMode}
    />
          <label htmlFor="logo-upload">
            <Button variant="contained" component="span" disabled={!editMode}>
            {t('settings.logoBtn')}
            </Button>
          </label>
          {settings.logo && (
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              {t('settings.selectedFile')} {settings.logo.name}
            </Typography>
          )}
        </Box>
  
        {/* Предварительный просмотр логотипа */}
        {logoPreview && (
          <Box sx={{ mt: 2, mb: 2 }}>
            <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: '200px', maxHeight: '100px' }} />
          </Box>
        )}
      </Box>
  
      {/* Локация компании */}
      <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
        {t('settings.chapter2Title')}
        </Typography>
        <TextField
          label={t('settings.coordinatesLabel')}
          value={settings.company_location}
          onChange={(e) => handleChange('company_location', e.target.value)}
          fullWidth
          margin="normal"
          disabled={!editMode}
        />
        <Box sx={{ height: 400, width: '100%', mb: 2 }}>
          <MapComponent coordinates={settings.company_coordinates} onPositionChange={handlePositionChange} />
        </Box>
      </Box>
  
      {/* Правила посещаемости */}
      <Box sx={{ mb: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
        {t('settings.chapter3Title')}
        </Typography>
  
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label={t('settings.startLabel')}
              value={settings.start_time}
              onChange={(newValue) => handleChange('start_time', newValue)}
              disabled={!editMode}
              format="HH:mm"
              sx={{ flexGrow: 1 }}
            />
            <TextField
              label={t('settings.lateLabel')}
              type="number"
              value={settings.late_time}
              onChange={(e) => handleChange('late_time', parseInt(e.target.value))}
              disabled={!editMode}
              sx={{ flexGrow: 1 }}
            />
            <TimePicker
              label={t('settings.endLabel')}
              value={settings.end_time}
              onChange={(newValue) => handleChange('end_time', newValue)}
              disabled={!editMode}
              format="HH:mm"
              sx={{ flexGrow: 1 }}
            />
            <TimePicker
              label={t('settings.overEndLabel')}
              value={settings.over_end_time}
              onChange={(newValue) => handleChange('over_end_time', newValue)}
              disabled={!editMode}
              format="HH:mm"
              sx={{ flexGrow: 1 }}
            />
          </LocalizationProvider>
        </Box>
  
        {/* Время сверхурочной работы */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">{t('settings.overTitle')}</Typography>
          <Typography variant="body2">{t('settings.overStartTitle')} {formatTime(settings.end_time)}</Typography>
          <Typography variant="body2">{t('settings.overEndTitle')} {formatTime(settings.over_end_time)}</Typography>
        </Box>
      </Box>
  
      {/* Кнопка сохранения */}
      {editMode && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAll}
            sx={{ fontSize: '0.9rem', padding: '6px 16px' }}
          >
            {t('settings.saveBtn')}
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default CompanySettings;