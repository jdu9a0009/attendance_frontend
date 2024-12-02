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
  const [data, setData] = useState<{ value: number; label: string; color: string }[]>([]);
  const { t } = useTranslation('admin'); // Используем useTranslation для получения функции t

  useEffect(() => {
    getPieData();
  }, [t]); // Добавляем t в зависимости useEffect, чтобы реагировать на изменения языка

  const getPieData = async () => {
    try {
      const response = await axiosInstance().get('/attendance/piechart');
      const pieValue: PieData = response.data.data;
      
      setData([
        { value: pieValue.come, label: t('pieChart.come'), color: '#3082db' }, 
        { value: pieValue.absent, label: t('pieChart.absent'), color: '#f75454' }, 
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  // Добавим сдвиг текста правее с помощью dx
  const PieLabel = styled('text')({
    fill: 'black',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 14,
    transform: 'translate(20px)', // смещаем текст правее
  });

  return (
    <PieChart
      series={[{ data, innerRadius: 80 }]} // Не нужно передавать color сюда
      {...size}
    >
      {data.length > 0 && (
        <>
          {/* Отодвигаем текст с помощью transform или dx */}
          <PieLabel x={size.width / 2} y={size.height / 2}>
            
          </PieLabel>
          <PieCenterLabel>{data[0].value}%</PieCenterLabel>
        </>
      )}
    </PieChart>
  );
}
