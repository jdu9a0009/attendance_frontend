import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  SelectChangeEvent,
  List,
  ListItem,
} from "@mui/material";
import line from "./Line.module.css";
import axiosInstance from "../../utils/libs/axios";
import { useTranslation } from "react-i18next";


interface LineData {
  percentage: number;
  work_day: string;
}

function LineChartComponent() {
  const { t } = useTranslation(['admin', 'common']);
  const monthsOfYear: string[] = [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ];

  const today = new Date();
  const currentYear = today.getFullYear().toString();
  const currentMonth = monthsOfYear[today.getMonth()];
  const currentDay = today.getDate();

  const defaultInterval = currentDay <= 10 ? 0 : currentDay <= 20 ? 1 : 2;

  // Generate years dynamically from 2022 to the current year
  const years: string[] = Array.from(
    { length: parseInt(currentYear) - 2022 + 1 }, // Convert currentYear to number
    (_, i) => (2022 + i).toString()
  );

  const [attendanceData, setAttendanceData] = useState<number[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const [interval, setInterval] = useState<number>(defaultInterval);
  const [openMonthDialog, setOpenMonthDialog] = useState(false);

  const chartRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState<number>(600);

  useLayoutEffect(() => {
    if (chartRef.current) {
      setChartWidth(chartRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, [selectedYear, selectedMonth, interval]); // Dependencies to refetch when month or interval changes

  const fetchData = async () => {
    try {
      const monthIndex = monthsOfYear.indexOf(selectedMonth) + 1;
      const monthString = String(monthIndex).padStart(2, "0");

      const response = await axiosInstance().get(
        `https://attendance-backend-24xu.onrender.com/api/v1/attendance/graph`,
        {
          params: {
            month: `${selectedYear}-${monthString}-01`,
            interval: interval,
          },
        }
      );

      const results: LineData[] = response.data.data.results;

      if (results.length === 0) {
        let days: string[] = [];
        switch (interval) {
          case 0:
            days = Array.from({ length: 10 }, (_, i) => `${i + 1}日`);
            break;
          case 1:
            days = Array.from({ length: 10 }, (_, i) => `${i + 11}日`);
            break;
          case 2:
            days = Array.from({ length: 10 }, (_, i) => `${i + 21}日`);
            break;
          default:
            days = [];
        }
        setDaysOfWeek(days);
        setAttendanceData(Array(10).fill(0)); // Default data (e.g., zeros)
      } else {
        const days = results.map((result) => {
          const day = new Date(result.work_day).getDate();
          return `${day}日`;
        });
        const percentages = results.map((result) => result.percentage);

        setDaysOfWeek(days);
        setAttendanceData(percentages);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleIntervalChange = (event: SelectChangeEvent<number>) => {
    setInterval(event.target.value as number);
  };

  const handleYearChange = (event: SelectChangeEvent<string>) => {
    setSelectedYear(event.target.value);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleMonthDialogOpen = () => {
    setOpenMonthDialog(true);
  };

  const handleMonthDialogClose = () => {
    setOpenMonthDialog(false);
    fetchData(); // Fetch data when dialog closes
  };

  return (
    <Box sx={{ backgroundColor: "#fff", padding: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" align="left" sx={{ marginBottom: 2 }}>
          {t('admin:lineChart.title')}
        </Typography>

        <div className={line.div}>
          <Select
            value={interval}
            onChange={handleIntervalChange}
            displayEmpty
            sx={{ marginRight: 2, minWidth: 80 }} // Added minWidth for better display
          >
            <MenuItem value={0}>{t('admin:lineChart.interval.first')}</MenuItem>
            <MenuItem value={1}>{t('admin:lineChart.interval.second')}</MenuItem>
            <MenuItem value={2}>{t('admin:lineChart.interval.third')}</MenuItem>
          </Select>
          <Button
            sx={{
              paddingTop: "15px",
              paddingBottom: "15px",
              color: "black",
              borderColor: "#c6c4c4",
              ":hover": { borderColor: "black", backgroundColor: "#FFFFFF" },
            }}
            variant="outlined"
            onClick={handleMonthDialogOpen}
          >
            {`${selectedMonth} ${selectedYear}年`}
          </Button>
        </div>
      </Box>
      <LineChart
        xAxis={[
          {
            scaleType: "point",
            data: daysOfWeek, // Data for the X axis
          },
        ]}
        yAxis={[
          {
            min: 0, // Set minimum value for Y axis
            max: 100,
            colorMap: {
              type: "continuous",
              min: -20,
              max: 80,
              color: ["transparent", "rgba(51, 84, 244, 0.6)"],
            },
          },
        ]}
        series={[
          {
            data: attendanceData, // Data for the Y axis
            area: true,
          },
        ]}
        sx={{
          backgroundColor: "#fff",
        }}
        width={chartWidth}
        height={235}
      />

      <Dialog open={openMonthDialog} onClose={handleMonthDialogClose}>
        <DialogTitle>{t('selectMonthAndYear')}</DialogTitle>
        <DialogContent>
          <Select value={selectedYear} onChange={handleYearChange} sx={{ minWidth: 300 }}>
            {years.map((year, index) => (
              <MenuItem key={index} value={year}>
                {`${year}年`}
              </MenuItem>
            ))}
          </Select>
          <List>
            {monthsOfYear.map((month, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleMonthChange(month)}
                selected={selectedMonth === month}
              >
                {month}
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMonthDialogClose}>{t('ok')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default LineChartComponent;
