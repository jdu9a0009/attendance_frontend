import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { Box, Typography, Paper, Snackbar, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { createByQRCode } from '../../utils/libs/axios.ts';

interface ServerResponse {
  data: {
    id: number;
    employee_id: string;
    full_name: string;
    work_day: string;
    come_time: string;
  } | null;
  message: string;
  status: boolean;
  error?: string;
}

const QRCodeScanner: React.FC = () => {
  const [scanState, setScanState] = useState({
    result: null as string | null,
    isScanning: true,
    isProcessing: false,
    serverMessage: '',
    employeeName: '',
    messageType: null as 'check-in' | 'check-out' | 'error' | null
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });
  
  const webcamRef = useRef<Webcam | null>(null);
  const scanningInterval = useRef<NodeJS.Timeout>();
  const resetTimeout = useRef<NodeJS.Timeout>();

  const getCurrentPosition = useCallback((): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('お使いのブラウザは位置情報をサポートしていません'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  }, []);

  const processQRCode = useCallback(async (code: string) => {
    setScanState(prev => ({ ...prev, isScanning: false, isProcessing: true }));
    
    try {
      const position = await getCurrentPosition();
      const response: ServerResponse = await createByQRCode(
        code,
        position.coords.latitude,
        position.coords.longitude
      );

      let messageType: 'check-in' | 'check-out' | 'error' | null = null;
      if (response.status) {
        const message = response.message.toLowerCase();
        if (message.includes('welcome')) messageType = 'check-in';
        else if (message.includes('get home safely') || message.includes('goodbye')) messageType = 'check-out';
        
        setScanState(prev => ({
          ...prev,
          result: response.data?.employee_id || '',
          serverMessage: response.message,
          employeeName: response.data?.full_name || '',
          messageType
        }));
        setSnackbar({ open: true, message: '記録が正常に作成されました' });
      } else {
        setScanState(prev => ({
          ...prev,
          serverMessage: '位置情報エラー：許可されたスキャンエリアから離れすぎています。',
          messageType: 'error'
        }));
        setSnackbar({ open: true, message: '記録の作成エラー：位置情報が無効です' });
      }
    } catch (error) {
      console.error('データ送信エラー:', error);
      setScanState(prev => ({
        ...prev,
        serverMessage: 'リクエストの処理中にエラーが発生しました。もう一度お試しください。',
        messageType: 'error'
      }));
      setSnackbar({ open: true, message: '記録の作成エラー' });
    } finally {
      setScanState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [getCurrentPosition]);

  const videoConstraints = useMemo(() => ({
    facingMode: 'environment', 
    width: { ideal: 1280 }, 
    height: { ideal: 720 }, 
    aspectRatio: 1, 
  }), []);

  const capture = useCallback(() => {
    if (scanState.isProcessing || !scanState.isScanning || !webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const sourceWidth = image.width;
      const sourceHeight = image.height;
      
      const scanAreaSize = Math.min(sourceWidth, sourceHeight) * 0.4;
      const startX = (sourceWidth - scanAreaSize) / 2;
      const startY = (sourceHeight - scanAreaSize) / 2;
      
      canvas.width = scanAreaSize;
      canvas.height = scanAreaSize;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Применяем фильтры для улучшения качества изображения
      ctx.filter = 'contrast(120%) brightness(90%) saturate(80%)';
      
      // Вырезаем и рисуем центральную область
      ctx.drawImage(
        image,
        startX, startY, scanAreaSize, scanAreaSize,
        0, 0, scanAreaSize, scanAreaSize
      );

      // Применяем дополнительную обработку изображения
      const imageData = ctx.getImageData(0, 0, scanAreaSize, scanAreaSize);
      const data = imageData.data;
      
      // Применяем алгоритм адаптивной коррекции яркости
      let max = 0;
      let min = 255;
      
      // Находим максимальное и минимальное значения яркости
      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (brightness > max) max = brightness;
        if (brightness < min) min = brightness;
      }
      
      // Корректируем контраст и яркость
      const range = max - min;
      const factor = 255 / range;
      
      for (let i = 0; i < data.length; i += 4) {
        for (let j = 0; j < 3; j++) {
          data[i + j] = Math.min(255, Math.max(0, (data[i + j] - min) * factor));
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      
      if (code) {
        processQRCode(code.data);
      }
    };
  }, [scanState.isProcessing, scanState.isScanning, processQRCode]);

  useEffect(() => {
    if (scanState.isScanning) {
      scanningInterval.current = setInterval(capture, 1000);
      return () => clearInterval(scanningInterval.current);
    } else {
      resetTimeout.current = setTimeout(() => {
        setScanState(prev => ({
          ...prev,
          isScanning: true,
          result: null,
          serverMessage: '',
          employeeName: '',
          messageType: null
        }));
      }, 3000);
      return () => clearTimeout(resetTimeout.current);
    }
  }, [scanState.isScanning, capture]);

  const messageColor = useMemo(() => {
    switch (scanState.messageType) {
      case 'check-in':
      case 'check-out':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'inherit';
    }
  }, [scanState.messageType]);

  const scannerStyles = useMemo(() => ({
    container: {
      height: '100vh',
      width: '100vw',
      position: 'relative' as const,
      overflow: 'hidden'
    },
    webcam: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
      filter: 'contrast(120%) brightness(90%)', 
    },
    overlay: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      aspectRatio: '1 / 1',
      border: '2px solid rgba(255, 255, 255, 0.8)',
      boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
      zIndex: 1
    },
    cornerTopLeft: {
      position: 'absolute' as const,
      top: -2,
      left: -2,
      width: '20px',
      height: '20px',
      borderTop: '4px solid #64B5F6', 
      borderLeft: '4px solid #64B5F6'
    },
    cornerTopRight: {
      position: 'absolute' as const,
      top: -2,
      right: -2,
      width: '20px',
      height: '20px',
      borderTop: '4px solid #64B5F6',
      borderRight: '4px solid #64B5F6'
    },
    cornerBottomLeft: {
      position: 'absolute' as const,
      bottom: -2,
      left: -2,
      width: '20px',
      height: '20px',
      borderBottom: '4px solid #64B5F6',
      borderLeft: '4px solid #64B5F6'
    },
    cornerBottomRight: {
      position: 'absolute' as const,
      bottom: -2,
      right: -2,
      width: '20px',
      height: '20px',
      borderBottom: '4px solid #64B5F6',
      borderRight: '4px solid #64B5F6'
    },
    scanLine: {
      position: 'absolute' as const,
      left: '0',
      width: '100%',
      height: '2px',
      backgroundColor: 'rgba(100, 181, 246, 0.8)', 
      animation: 'scan 2s linear infinite'
    },
    instruction: {
      position: 'absolute' as const,
      bottom: '15%',
      left: '50%',
      transform: 'translateX(-50%)',
      color: 'white',
      textAlign: 'center' as const,
      zIndex: 2,
      width: '100%',
      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
    }
  }), []);

  const ScanAnimation = useMemo(() => {
    return `
      @keyframes scan {
        0% {
          top: 0;
          opacity: 0.8;
        }
        50% {
          top: 100%;
          opacity: 0.6;
        }
        100% {
          top: 0;
          opacity: 0.8;
        }
      }
    `;
  }, []);

  return (
    <Box sx={scannerStyles.container}>
      {scanState.isScanning ? (
        <>
          <style>{ScanAnimation}</style>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={scannerStyles.webcam}
            imageSmoothing={false} // Отключаем сглаживание для лучшей четкости
          />
          <Box sx={scannerStyles.overlay}>
            <Box sx={scannerStyles.cornerTopLeft} />
            <Box sx={scannerStyles.cornerTopRight} />
            <Box sx={scannerStyles.cornerBottomLeft} />
            <Box sx={scannerStyles.cornerBottomRight} />
            <Box sx={scannerStyles.scanLine} />
          </Box>
          <Box sx={scannerStyles.instruction}>
            <Typography variant="h6" sx={{ marginBottom: 1 }}>
              QRコードを枠内に合わせてください
            </Typography>
            <Typography variant="body1">
              コードが鮮明に見えるように調整してください
            </Typography>
          </Box>
        </>
      ) : (
        <ResultDisplay
          scanState={scanState}
          messageColor={messageColor}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      />
    </Box>
  );
};

const ResultDisplay: React.FC<{
  scanState: {
    isProcessing: boolean;
    messageType: 'check-in' | 'check-out' | 'error' | null;
    serverMessage: string;
    employeeName: string;
    result: string | null;
  };
  messageColor: string;
}> = React.memo(({ scanState, messageColor }) => (
  <Paper
    elevation={3}
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: 4,
      textAlign: 'center',
      width: '90%',
      maxWidth: '600px',
      height: '80%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    {scanState.isProcessing ? (
      <ProcessingView />
    ) : (
      <ResultContent
        scanState={scanState}
        messageColor={messageColor}
      />
    )}
  </Paper>
));

const ProcessingView: React.FC = React.memo(() => (
  <>
    <CircularProgress size={120} sx={{ marginBottom: 4 }} />
    <Typography variant="h3" gutterBottom>
      処理中...
    </Typography>
    <Typography variant="h5">
      お待ちください
    </Typography>
  </>
));

const ResultContent: React.FC<{
  scanState: {
    messageType: 'check-in' | 'check-out' | 'error' | null;
    serverMessage: string;
    employeeName: string;
    result: string | null;
  };
  messageColor: string;
}> = React.memo(({ scanState, messageColor }) => (
  <>
    {scanState.messageType === 'error' ? (
      <ErrorIcon sx={{ fontSize: 180, color: 'red', marginBottom: 3 }} />
    ) : (
      <CheckCircleIcon sx={{ fontSize: 180, color: 'green', marginBottom: 3 }} />
    )}
    <Typography variant="h3" gutterBottom sx={{ color: messageColor }}>
      {scanState.messageType === 'check-in' ? 'チェックイン成功' : 
       scanState.messageType === 'check-out' ? 'チェックアウト成功' : 
       ''}
    </Typography>
    {scanState.serverMessage && (
      <Typography variant="h5" sx={{ marginTop: 2, color: messageColor }}>
        {scanState.serverMessage}
      </Typography>
    )}
    {scanState.employeeName && scanState.messageType !== 'error' && (
      <Typography variant="h3" sx={{ marginTop: 2, color: 'green' }}>
        {scanState.messageType === 'check-in' ? 'ようこそ' : 'お気をつけて'}, 
        {scanState.employeeName}さん！
      </Typography>
    )}
    {scanState.result && scanState.messageType !== 'error' && (
      <Typography variant="h5" sx={{ marginTop: 2 }}>
        従業員ID: {scanState.result}
      </Typography>
    )}
  </>
));

export default QRCodeScanner;