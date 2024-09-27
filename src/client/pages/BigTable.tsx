import React, { useState, useEffect } from 'react';
import AttendanceTable from '../../admin/components/Table/AttendanceTable';
import { Column } from '../../admin/components/Table/types';
import axiosInstance, { fetchDepartments, fetchPositions } from '../../utils/libs/axios';


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

const columns: Column[] = [
  { id: 'employee_id', label: 'ID' },
  { id: 'full_name', label: '名前', filterable: true },
  { id: 'department', label: '部署', filterable: true, filterValues: ['1ステージ', '2ステージ', '3ステージ', '4ステージ'] },
  { id: 'position', label: '役職', filterable: true, filterValues: ['開発者', 'マーケター', 'クラウドエンジニア', 'ソフトウェアエンジニア', 'CEO'] },
  { id: 'work_day', label: '勤務日' },
  { id: 'status', label: '状態', filterable: true, filterValues: ['出席', '欠席'] },
  { id: 'come_time', label: '出勤時間' },
  { id: 'leave_time', label: '退勤時間' },
  { id: 'total_hourse', label: '総労働時間' },
] as Column[];




const BigTablePage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    // const fetchAttendanceStats = async() => {
    //   try {
    //     const response = await axiosInstance().get('/attendance/list')
    //     if (response.data.data.status) {
    //       setAttendanceStats(response.data.data);
    //     }
    //   }
    //   catch (error) {
    //     console.log('Oshibka', error);
    //   }
    // }
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

  console.log("Departments in BigTablePage:", departments);
console.log("Positions in BigTablePage:", positions);


  return (
    <AttendanceTable
      columns={columns}
      showCalendar={false}  
      tableTitle="DashboardTable"
      // width="100%"
      // height="90%"
      departments={departments}
      positions={positions}/>
    
  );
};

export default BigTablePage;
