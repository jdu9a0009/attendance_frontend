import { useState, useEffect } from "react";
import {
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Modal,
} from "@mui/material";
import {
  Department,
  Position,
} from "../pages/DepartmentPositionManagement.tsx";
import { createPosition, updatePosition } from "../../utils/libs/axios.ts";
import { useTranslation } from "react-i18next";
import { AxiosError } from "./Table/types.ts";

interface PositionDialogProps {
  open: boolean;
  onClose: () => void;
  position: Position | null;
  departments: Department[];
  onSave: (position: Position) => void;
}

function PositionDialog({
  open,
  onClose,
  position,
  departments,
  onSave,
}: PositionDialogProps) {
  const [name, setName] = useState(position?.name || "");
  const [departmentId, setDepartmentId] = useState<number | string>(
    position?.department_id || ""
  );
  const [error, setError] = useState("");
  const { t } = useTranslation("admin");

  useEffect(() => {
    if (position) {
      setError("");
      setName(position.name);
      setDepartmentId(position.department_id);
    } else {
      setError("");
      setName("");
      setDepartmentId("");
    }
  }, [position, open]);

  const handleSave = async () => {
    setError("");
    if (
      position &&
      name === position.name &&
      departmentId === position.department_id
    ) {
      setError("You choosing same thing");
      return;
    }

    if (name.trim() !== "" && departmentId) {
      let savedPosition;
      const department =
        departments.find((dept) => dept.id === Number(departmentId))?.name ||
        "Unknown";

      try {
        if (position) {
          await updatePosition(position.id, name, Number(departmentId));
          savedPosition = {
            id: position.id,
            name,
            department_id: Number(departmentId),
            department,
          };
        } else {
          const response = await createPosition(name, Number(departmentId));
          savedPosition = {
            id: response.data.id,
            name: response.data.name,
            department_id: response.data.department_id,
            department,
          };
        }

        onSave(savedPosition);
        onClose();
      } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          setError(axiosError.response.data.error);
        } else {
          setError("予期せぬエラーが発生しました");
        }
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
      <DialogTitle>
        {position
          ? t("positionTable.dialogTitleEdit")
          : t("positionTable.dialogTitleAdd")}
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label={t("positionTable.label")}
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <FormControl fullWidth sx={{ marginTop: 2 }}>
          <InputLabel id="department-select-label">
            {t("positionTable.changeDep")}
          </InputLabel>
          <Select
            labelId="department-select-label"
            id="department-select"
            value={departmentId}
            label={t("positionTable.changeDep")}
            onChange={(e) => setDepartmentId(e.target.value as number)}
          >
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.id}>
                {department.name}
              </MenuItem>
            ))}
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
      </Box>
      </Modal>
  );
};

const modalStyle = {
  position: "absolute" as "absolute",
  borderRadius: "12px",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 1,
};

export default PositionDialog;
