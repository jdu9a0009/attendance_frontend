// src/admin/components/Table/types.ts

export type DateOrString = Date | string | number | undefined;

export interface FilterState {
    [key: string]: string[];
  }

  export interface TableData {
    id: number;
    employee_id?: string;
    password?: string;
    role?: string;
    full_name: string;
    department: string;
    department_id?: number;
    position?: string;
    position_id?: number;
    date?: DateOrString;
    status?: boolean;
    checkIn?: DateOrString;
    checkOut?: DateOrString;
    totalHrs?: number;
    phone?: string;
    email?: string;
  }

  export interface Column {
    id: keyof TableData | 'action';
    label: string;
    filterable?: boolean;
    filterValues?: string[];
  }

export interface Employee {
  id: number;
  employee_id: string | null;
  department: string | null;
  full_name: string | null;
  status: boolean | null;
}

export interface Department {
  department: string;
  employee_count: string;
}