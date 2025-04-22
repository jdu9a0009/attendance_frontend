import React, { useRef, useState } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import { uploadExcelFile, downloadSampleFile } from "../../../utils/libs/axios.ts";
import { SnackbarCloseReason } from "@mui/material";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: {
      main: '#105E82',
    },
    success: {
      main: '#4CAF50', // зеленый
    },
    warning: {
      main: '#FFC107', // желтый
    },
    error: {
      main: '#F44336', // красный
    },
    info: {
      main: '#9E9E9E', // серый
    }
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "warning" | "error" | "info">("info");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleModeChange = (event: SelectChangeEvent<number>) => {
    setMode(event.target.value as number);
  };

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleDownloadSample = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await downloadSampleFile();
    } catch (error) {
      console.error("サンプルファイルのダウンロード中にエラーが発生しました:", error);
      showSnackbar("ファイルのダウンロードエラー", "error");
    }
  };

  const resetFileInput = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showSnackbar = (message: string, severity: "success" | "warning" | "error" | "info" = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    setTimeout(() => {
      setSnackbarOpen(false);
    }, 3000); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedFile) {
      showSnackbar("ファイルを選択してください", "error");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("excell", selectedFile);
      formData.append("mode", mode.toString());
  
      const result = await uploadExcelFile(formData);
  
      if (result.ステータス === 1) {
        showSnackbar("ファイルのアップロードが完了しました", "success"); // Зеленый
        onUpload(selectedFile, mode);
        onClose();
        resetFileInput();
      } else if (result.ステータス === 2) {
        showSnackbar("いくつかのエラーがありますがファイルをアップロードしました", "warning"); // Желтый
        onUpload(selectedFile, mode);
        onClose();
        resetFileInput();
      } else if (result.ステータス === 3) {
        showSnackbar("ファイルのアップロードに失敗しました。エラーを確認してください", "error"); // Красный
      } else {
        showSnackbar("不明な応答ステータス", "info"); // Серый
      }
    } catch (error) {
      console.error("ファイルのアップロード中にエラーが発生しました:", error);
      if (axios.isAxiosError(error) && error.response) {
        showSnackbar(error.response.data.message || "ファイルのアップロードエラー", "error");
      } else {
        showSnackbar("ファイルのアップロードエラー", "error");
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
            作成
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
                  <span>参照...</span>
                  <span style={{ color: '#666' }}>
                    {selectedFile ? selectedFile.name : 'ファイルが選択されていません'}
                  </span>
                  <input
                    type="file"
                    hidden
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </Button>
                <Typography variant="caption" color="textSecondary">
                  xlsxファイルをアップロード
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel sx={{ '&.Mui-focused': { color: '#105E82' } }}>
                  モード
                </InputLabel>
                <Select
                  value={mode}
                  label="モード"
                  onChange={handleModeChange}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#105E82',
                    },
                  }}
                >
                  <MenuItem value={1}>作成</MenuItem>
                  <MenuItem value={2}>更新</MenuItem>
                  <MenuItem value={3}>削除</MenuItem>
                </Select>
                <Typography variant="caption" color="textSecondary">
                  XLSXの処理操作モードを選択してください
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
                xlsxファイルをアップロード
              </Button>

              <Typography variant="body2" color="textSecondary">
                初めての方で作成に問題がある場合は、以下のリンクの説明をお読みください：
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
                XLSXからの作成方法
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
          severity={snackbarSeverity}
          sx={{ 
            width: '100%',
            '& .MuiAlert-icon': {
              color: snackbarSeverity === 'success' ? '#4CAF50' : 
                     snackbarSeverity === 'warning' ? '#FFC107' : 
                     snackbarSeverity === 'error' ? '#F44336' : '#9E9E9E',
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