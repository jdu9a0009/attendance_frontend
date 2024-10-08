// TimesheetData.ts

export interface TimesheetDay {
<<<<<<< HEAD
  work_day: string; 
  come_time: string | null;
  leave_time: string | null;
  total_hours: string | null;
  weekday?: string; 
}

export interface TimesheetWeekData {
  [key: string]: TimesheetDay[];
}

export const intervals = ['0', '1', '2'];
=======
    work_day: string; 
    come_time: string | null;
    leave_time: string | null;
    total_hours: string | null;
    weekday?: string; 
  }
  
  export interface TimesheetWeekData {
    [key: string]: TimesheetDay[];
  }
  
  export const intervals = ['0', '1', '2'];
  
>>>>>>> suhrob2
