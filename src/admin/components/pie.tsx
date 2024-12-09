import React, { useEffect, useState } from 'react'; 
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../utils/libs/axios';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('admin');

  useEffect(() => {
    getPieData();
  }, [t]);

  const getPieData = async () => {
    try {
      const response = await axiosInstance().get('/attendance/piechart');
      console.log('API Response:', response.data); // Log the full API response

      const pieValue: PieData = response.data.data;
      const colors = response.data.Colors; // Get colors from the response

      setData([
        { value: pieValue.come, label: t('pieChart.come'), color: colors.present_color }, 
        { value: pieValue.absent, label: t('pieChart.absent'), color: colors.absent_color }, 
      ]);
    } catch (err) {
      console.log('Error fetching pie chart data:', err);
    }
  };

  const PieLabel = styled('text')({
    fill: 'black',
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 14,
    transform: 'translate(20px)',
  });

  return (
    <PieChart
      series={[{ data, innerRadius: 80 }]} 
      {...size}
    >
      {data.length > 0 && (
        <>
          <PieLabel x={size.width / 2} y={size.height / 2}>
          </PieLabel>
          <PieCenterLabel>{data[0].value}%</PieCenterLabel>
        </>
      )}
    </PieChart>
  );
}
