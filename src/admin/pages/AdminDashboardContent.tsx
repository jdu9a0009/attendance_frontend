import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LineChartComponent from "../components/LineChart";
import PieChartWithCustomizedLabel from "../components/pie";
import SimpleBarChart from "../components/Bar";
import AttendanceTable from "../components/Table/AttendanceTable";
import { Column } from "../components/Table/types";
import axiosInstance, {fetchDepartments, fetchPositions } from '../../utils/libs/axios';

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

function AdminDashboardContent() {
  const { t } = useTranslation('admin'); // Используем useTranslation для доступа к переводам

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    total_employee: 0,
    ontime: 0,
    absent: 0,
    late_arrival: 0,
    early_departures: 0,
    early_come: 0,
  });

  const columns: Column[] = [
    { id: 'employee_id', label: t('employeeId') },
    { id: 'full_name', label: t('fullName'), filterable: true },
    { id: 'department', label: t('department'), filterable: true },
    { id: 'position', label: t('position'), filterable: true },
    { id: 'work_day', label: t('workDay') },
    { id: 'status', label: t('status'), filterable: true },
    { id: 'come_time', label: t('comeTime') },
    { id: 'leave_time', label: t('leaveTime') },
    { id: 'total_hourse', label: t('totalHours') },
  ] as Column[];

  useEffect(() => {
    const fetchAttendanceStats = async () => {
      try {
        const response = await axiosInstance().get("/attendance");
        if (response.status === 200 && response.data.status) {
          setAttendanceStats(response.data.data);
        }
      } catch (err) {
        console.error("Ошибка при получении данных o посещаемости:", err);
      }
    };

    fetchAttendanceStats();
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const response = await fetchDepartments();
        setDepartments(response); 
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

    const loadPositions = async () => {
      try {
        const response = await fetchPositions();
        setPositions(response); 
      } catch (error) {
        console.error("Failed to fetch positions", error);
      }
    };

    loadDepartments();
    loadPositions();
  }, []);
  
  return (
    <>
      <div className="DashboardContainer">
        <div className="Chart-2">
            <PieChartWithCustomizedLabel />
        </div>
        <div className="Cards">
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.total_employee}</p>
              <p className="Card-text">{t('totalEmployee')}</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/total_employees.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.ontime}</p>
              <p className="Card-text">{t('onTime')}</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/on_time.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.absent}</p>
              <p className="Card-text">{t('absent')}</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/absent.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.late_arrival}</p>
              <p className="Card-text">{t('lateArrival')}</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/late_arrival.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.early_departures}</p>
              <p className="Card-text">{t('earlyDepartures')}</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/early_departures.png")}></img>
            </div>
          </div>
          <div className="Card">
            <div className="data">
              <p className="Card-amount">{attendanceStats.early_come}</p>
              <p className="Card-text">{t('earlyCome')}</p>
            </div>
            <div className="icon">
              <img src={require("../../shared/png/time-off.png")}></img>
            </div>
          </div>
        </div>
      </div>
      <div className="Charts">
        <div className="Chart-1">
            <LineChartComponent />
        </div>
        <div className="Chart-3">
            <SimpleBarChart/>
        </div>
      </div>
      <div className="TableSection">
        <AttendanceTable departments={departments} positions={positions} columns={columns} showCalendar={true} tableTitle={t('common:table.title')}/>
      </div>
    </>
  );
}

export default AdminDashboardContent;
