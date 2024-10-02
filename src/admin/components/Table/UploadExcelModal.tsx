import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { uploadExcelFile } from "../../../utils/libs/axios";
import { useTranslation } from "react-i18next";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
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
      excell.append("excell", selectedFile);  // Используем 'excell' как имя поля
  
      await uploadExcelFile(excell);
  
      onUpload(selectedFile);
  
      onClose();
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
    }
  };

  return (
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
          <Box sx={{ mb: 3 }}> {/* Added spacing */}
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
  );
};

export default UploadExcelModal;