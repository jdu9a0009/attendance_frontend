import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { uploadExcelFile } from "../../../utils/libs/axios";
import { useTranslation } from "react-i18next";
import { SnackbarCloseReason } from "@mui/material";

interface UploadExcelModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadExcelModal: React.FC<UploadExcelModalProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { t } = useTranslation('admin');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedFile) {
      alert("Пожалуйста, выберите файл.");
      return;
    }
  
    try {
      console.log("Загружаемый файл:", selectedFile);
  
      const excell = new FormData();
      excell.append("excell", selectedFile);
  
      const response = await uploadExcelFile(excell);
  
      // Форматируем сообщение для Snackbar
      const message = `
        Excell rows that user not created due to incomplete data: ${response["Excell rows that user not created due to incomplete data"].join(", ")}
        Total number of successfully created users: ${response["Total number of successfully created users"]}
      `;
  
      showSnackbar(message.trim()); 
  
      onUpload(selectedFile);
      onClose();
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      showSnackbar("Ошибка при загрузке файла."); 
    }
  };
  

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            {t('uploadModal.title')}
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                component="label"
              >
                {t('uploadModal.selectedFileBtn')}
                <input
                  type="file"
                  hidden
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  required
                />
              </Button>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {t('uploadModal.fileName')} {selectedFile.name}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stack direction="row" spacing={1}>
                <Button onClick={onClose}>{t('uploadModal.cancelBtn')}</Button>
                <Button type="submit" variant="contained" disabled={!selectedFile}>
                  {t('uploadModal.uploadBtn')}
                </Button>
              </Stack>
            </Box>
          </form>
        </Box>
      </Modal>

      <Snackbar
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={handleSnackbarClose}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Центр экрана
>
  <Alert
    onClose={handleSnackbarClose}
    severity="warning"
    sx={{ bgcolor: '#ffc107', color: 'white' }} // Ярко-желтый без прозрачности
  >
    {snackbarMessage}
  </Alert>
</Snackbar>

    </>
  );
};

export default UploadExcelModal;
