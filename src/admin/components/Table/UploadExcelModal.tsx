import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Link,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { uploadExcelFile, downloadSampleFile } from "../../../utils/libs/axios";
import { useTranslation } from "react-i18next";
import { SnackbarCloseReason } from "@mui/material";
import axios from "axios";

// Создаем кастомную тему
const theme = createTheme({
  palette: {
    primary: {
      main: '#105E82',
    },
  },
});

interface UploadExcelModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File, mode: number) => void;
}

const UploadExcelModal: React.FC<UploadExcelModalProps> = ({
  open,
  onClose,
  onUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<number>(1);
  // const { t } = useTranslation('admin');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userCreated, setUserCreated] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleModeChange = (event: any) => {
    setMode(event.target.value);
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

  const handleDownloadSample = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await downloadSampleFile(); // Ожидаем ответ от функции
      // Обработка успешного скачивания
    } catch (error) {
      console.error("Error downloading sample file:", error);
      showSnackbar("Error downloading file");
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedFile) {
      showSnackbar("Please select a file");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("excell", selectedFile); // Замените "file" на "excell"
      formData.append("mode", mode.toString()); // Добавляем mode как строку
  
      const response = await uploadExcelFile(formData);
  
      showSnackbar("File uploaded successfully");
      onUpload(selectedFile, mode);
      setUserCreated(prev => !prev);
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || "Error uploading file";
        showSnackbar(errorMessage);
      } else {
        showSnackbar("Error uploading file");
      }
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            borderRadius: "10px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ mb: 3 }}>
            Create
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ 
                    height: '56px',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    pl: 2,
                    borderColor: '#105E82',
                    color: '#105E82',
                    '&:hover': {
                      borderColor: '#105E82',
                      opacity: 0.8,
                    },
                  }}
                >
                  <span>Browse...</span>
                  <span style={{ color: '#666' }}>
                    {selectedFile ? selectedFile.name : 'No file selected.'}
                  </span>
                  <input
                    type="file"
                    hidden
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                  />
                </Button>
                <Typography variant="caption" color="textSecondary">
                  Upload xlsx file
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel sx={{ '&.Mui-focused': { color: '#105E82' } }}>
                  Mode
                </InputLabel>
                <Select
                  value={mode}
                  label="Mode"
                  onChange={handleModeChange}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#105E82',
                    },
                  }}
                >
                  <MenuItem value={1}>Create</MenuItem>
                  <MenuItem value={2}>Update</MenuItem>
                  <MenuItem value={3}>Delete</MenuItem>
                </Select>
                <Typography variant="caption" color="textSecondary">
                  Choose the operation mode for processing the XLSX
                </Typography>
              </FormControl>

              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                disabled={!selectedFile}
                sx={{
                  backgroundColor: '#105E82',
                  '&:hover': {
                    backgroundColor: '#105E82',
                    opacity: 0.8,
                  },
                }}
              >
                Upload xlsx file
              </Button>

              <Typography variant="body2" color="textSecondary">
                If you are new here and want to create but are having trouble, 
                please read the instructions in the link below:
              </Typography>
              <Link
                href="#"
                onClick={handleDownloadSample}
                sx={{ 
                  color: '#105E82',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                How to create from XLSX
              </Link>
            </Stack>
          </form>
        </Box>
      </Modal>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="info"
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              color: '#105E82',
            },
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default UploadExcelModal;