import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { Department } from "../pages/DepartmentPositionManagement.tsx";
import { createDepartment, updateDepartment } from "../../utils/libs/axios.ts";
import { useTranslation } from "react-i18next";
import { AxiosError } from "./Table/types.ts";

interface DepartmentDialogProps {
  open: boolean;
  onClose: () => void;
  department: Department | null;
  onSave: (department: Department) => void;
  departments: Department[];
  nextDisplayNumber: number;
  onDisplayNumberChange: (number: number) => void;
}

function DepartmentDialog({
  open,
  onClose,
  department,
  onSave,
  departments,
  nextDisplayNumber,
  onDisplayNumberChange,
}: DepartmentDialogProps) {
  const [name, setName] = useState(department?.name || "");
  const [displayNumber, setDisplayNumber] = useState<number>(
    department?.display_number || nextDisplayNumber
  );
  const [departmentNickname, setDepartmentNickname] = useState(
    department?.department_nickname || ""
  );
  const [error, setError] = useState("");
  const { t } = useTranslation("admin");

  useEffect(() => {
    if (open) {
      setError(""); 
    }
    if (department) {
      setName(department.name);
      setDisplayNumber(department.display_number);
      setDepartmentNickname(department.department_nickname || "");
    } else {
      setName("");
      setDisplayNumber(nextDisplayNumber);
      setDepartmentNickname("");
    }
  }, [department, nextDisplayNumber, open]);

  const handleSave = async () => {
    setError("");
    if (name.trim() !== "") {
      let savedDepartment;

      if (department) {
        try {
          const conflictingDepartment = departments.find(
            (dep) =>
              dep.display_number === displayNumber && dep.id !== department.id
          );

          if (conflictingDepartment) {
            const oldDisplayNumber = department.display_number;

            await updateDepartment(
              conflictingDepartment.id,
              conflictingDepartment.name,
              oldDisplayNumber,
              conflictingDepartment.department_nickname
            );
            await updateDepartment(
              department.id,
              name,
              displayNumber,
              departmentNickname
            );

            savedDepartment = {
              id: department.id,
              name,
              display_number: displayNumber,
              department_nickname: departmentNickname,
            };
            onSave(savedDepartment);
            setError("");
            onClose();
          } else {
            await updateDepartment(
              department.id,
              name,
              displayNumber,
              departmentNickname
            );
            savedDepartment = {
              id: department.id,
              name,
              display_number: displayNumber,
              department_nickname: departmentNickname,
            };
            onSave(savedDepartment);
            setError("");
            onClose();
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError) {
            setError(axiosError.error);
          } else {
            setError("予期せぬエラーが発生しました");
          }
        }
      } else {
        try {
          const response = await createDepartment(
            name,
            displayNumber,
            departmentNickname
          );
          savedDepartment = {
            id: response.data.id,
            name: response.data.name,
            display_number: displayNumber,
            department_nickname: response.data.department_nickname,
          };
          onSave(savedDepartment);
          onClose();
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError) {
            setError(axiosError.error);
          } else {
            setError("予期せぬエラーが発生しました");
          }
        }
      }

      
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {department
          ? t("departmentTable.dialogTitleEdit")
          : t("departmentTable.dialogTitleAdd")}
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t("departmentTable.label")}
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          margin="dense"
          id="department-nickname"
          label={t("departmentTable.departmentNickname")}
          type="text"
          fullWidth
          variant="standard"
          value={departmentNickname}
          onChange={(e) => setDepartmentNickname(e.target.value)}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="display-number-label">表示順</InputLabel>
          <Select
            labelId="display-number-label"
            value={displayNumber}
            label="表示順"
            onChange={(e) => {
              setDisplayNumber(Number(e.target.value));
              onDisplayNumberChange(Number(e.target.value));
            }}
          >
            {departments.map((dep) => (
              <MenuItem
                key={dep.id}
                value={dep.display_number}
                sx={{ opacity: dep.id !== department?.id ? 0.5 : 1 }}
              >
                {`${dep.display_number} (${dep.name})`}
              </MenuItem>
            ))}
            {!department && (
              <MenuItem value={nextDisplayNumber}>
                {`${nextDisplayNumber} (新規)`}
              </MenuItem>
            )}
          </Select>
        </FormControl>
        <Typography variant="body2" color="error">
        {error}
      </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DepartmentDialog;
