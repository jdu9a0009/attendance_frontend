import React from "react";
import {
  TableHead,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Column, FilterState } from "./types";

interface AttendanceTableHeadProps {
  columns: Column[];
  filters: FilterState;
  onFilterChange: (columnId: string, value: string) => void;
  statusOptions?: string[];
  departments: Department[];
  positions: Position[];
}

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

const AttendanceTableHead: React.FC<AttendanceTableHeadProps> = ({
  columns,
  filters,
  onFilterChange,
  statusOptions,
  departments,
  positions,
}) => {
  return (
    <TableHead>
      <TableRow>
        {columns.map((column) => (
          <TableCell key={column.id}>
            {["status", "position", "department"].includes(column.id) ? (
              <Select
                value={filters[column.id] || ""}
                onChange={(e: SelectChangeEvent<string>) =>
                  onFilterChange(column.id, e.target.value)
                }
                displayEmpty
                renderValue={(selected) => {
                  if (selected === "") {
                    return column.label;
                  }
                  return selected;
                }}
                sx={{
                  ".MuiSelect-select": {
                    padding: 0,
                    minWidth: 40,
                    border: "none",
                  },
                  ".MuiOutlinedInput-notchedOutline": { border: 0 },
                }}
              >
                <MenuItem value="">
                  <em>すべて</em>
                </MenuItem>
                {column.id === "status" && statusOptions
                  ? statusOptions.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))
                  : null}
                {column.id === "department"
                  ? departments.map((department) => (
                      <MenuItem key={department.id} value={department.name}>
                        {department.name}
                      </MenuItem>
                    ))
                  : null}
                {column.id === "position"
                  ? positions.map((position) => (
                      <MenuItem key={position.id} value={position.name}>
                        {position.name}
                      </MenuItem>
                    ))
                  : null}
              </Select>
            ) : (
              column.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default AttendanceTableHead;
