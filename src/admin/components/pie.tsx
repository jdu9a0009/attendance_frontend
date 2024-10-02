import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next'; // Подключаем useTranslation

interface PieData {
  absent: number;
  come: number;
}

interface PieCenterLabelProps {
  children: React.ReactNode;
}

const size = {
  width: 300,
  height: 300,
};

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 30,
}));

function PieCenterLabel({ children }: PieCenterLabelProps) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

export default function PieChartWithCenterLabel() {
  const [data, setData] = useState<{ value: number; label: string }[]>([]);
  const { t } = useTranslation('admin'); // Используем useTranslation для получения функции t

  useEffect(() => {
    getPieData();
  }, [t]); // Добавляем t в зависимости useEffect, чтобы реагировать на изменения языка

  const getPieData = async () => {
    try {
      const response = await axiosInstance().get('/attendance/piechart');
      const pieValue: PieData = response.data.data;
      
      setData([
        { value: pieValue.come, label: t('pieChart.come') }, // Используем перевод для меток
        { value: pieValue.absent, label: t('pieChart.absent') }, // Используем перевод для меток
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
      {data.length > 0 && <PieCenterLabel>{data[0].value}%</PieCenterLabel>}
    </PieChart>
  );
}
