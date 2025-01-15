import { TableData } from "./types";

// Пример данных с корректными типами
const mockData = {
  results: [
    {
      id: '1',
      full_name: 'John Doe',
      department: 'IT',
      position: 'Developer',
      work_day: new Date('2024-07-01T00:00:00Z'),
      status: 'Present',
      come_time: new Date('2024-07-01T09:00:00Z'),
      leave_time: new Date('2024-07-01T17:00:00Z'),
      total_hourse: 8
    }
  ],
  status: true
};

export default mockData;
