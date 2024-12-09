import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';

// const PRESET_COLORS = [
//   '#FF0000', '#FF4500', '#FFA500', '#FFD700', '#FFFF00', '#9ACD32',
//   '#008000', '#20B2AA', '#87CEEB', '#0000FF', '#4B0082', '#800080',
//   '#FF1493', '#FF69B4', '#FFC0CB', '#FFFFFF', '#808080', '#000000',
// ];

interface HSV {
  h: number;
  s: number;
  v: number;
}

const ColorPickerButton: React.FC<{
  color: string;
  label: string;
  onChange: (color: string) => void;
  disabled?: boolean;
}> = ({ color, label, onChange, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const [hsv, setHsv] = useState<HSV>({ h: 0, s: 100, v: 100 });
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingSV, setIsDraggingSV] = useState(false);
  
  const hueRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);

  // Преобразование HSV в RGB
  const hsvToRgb = (h: number, s: number, v: number): number[] => {
    s = s / 100;
    v = v / 100;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    
    let r = 0, g = 0, b = 0;
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  };

  // Преобразование RGB в HEX
  const rgbToHex = (r: number, g: number, b: number): string => 
    `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;

  const handleHueMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDraggingHue(true);
    updateHue(e);
  };

  const handleSVMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDraggingSV(true);
    updateSV(e);
  };

  const updateHue = (e: React.MouseEvent | MouseEvent) => {
    if (!hueRef.current || disabled) return;
    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHsv(prev => ({ ...prev, h: x }));
  };

  const updateSV = (e: React.MouseEvent | MouseEvent) => {
    if (!svRef.current || disabled) return;
    const rect = svRef.current.getBoundingClientRect();
    const s = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const v = Math.max(0, Math.min(100, (1 - (e.clientY - rect.top) / rect.height) * 100));
    setHsv(prev => ({ ...prev, s, v }));
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHue) updateHue(e);
      if (isDraggingSV) updateSV(e);
    };

    const handleMouseUp = () => {
      setIsDraggingHue(false);
      setIsDraggingSV(false);
    };

    if (isDraggingHue || isDraggingSV) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingHue, isDraggingSV]);

  useEffect(() => {
    const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
    const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    setLocalColor(hex);
    onChange(hex);
  }, [hsv, onChange]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          backgroundColor: localColor,
          cursor: disabled ? 'default' : 'pointer',
          border: '1px solid grey',
          opacity: disabled ? 0.5 : 1,
        }}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={() => !disabled && setOpen(true)}
        disabled={disabled}
      >
        {label}
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Выберите цвет</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            {/* Основная область выбора цвета */}
            <Box
              ref={svRef}
              onMouseDown={handleSVMouseDown}
              sx={{
                width: '100%',
                height: 200,
                position: 'relative',
                marginBottom: 2,
                cursor: 'crosshair',
                background: `linear-gradient(to right, #fff, hsl(${hsv.h * 360}, 100%, 50%))`,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, #000, transparent)',
                },
              }}
            >
              {/* Указатель выбранного цвета */}
              <Box
                sx={{
                  position: 'absolute',
                  left: `${hsv.s}%`,
                  top: `${100 - hsv.v}%`,
                  width: 10,
                  height: 10,
                  border: '2px solid white',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              />
            </Box>

            {/* Полоса выбора оттенка */}
            <Box
              ref={hueRef}
              onMouseDown={handleHueMouseDown}
              sx={{
                width: '100%',
                height: 20,
                marginBottom: 2,
                cursor: 'ew-resize',
                background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)',
                position: 'relative',
                borderRadius: 1,
              }}
            >
              {/* Указатель выбранного оттенка */}
              <Box
                sx={{
                  position: 'absolute',
                  left: `${hsv.h * 100}%`,
                  top: '50%',
                  width: 4,
                  height: '140%',
                  background: 'white',
                  border: '1px solid #000',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              />
            </Box>

            {/* <Typography sx={{ mb: 1 }}>Предустановленные цвета:</Typography>
            <Grid container spacing={1}>
              {PRESET_COLORS.map((presetColor) => (
                <Grid item key={presetColor}>
                  <Box
                    onClick={() => {
                      setLocalColor(presetColor);
                      onChange(presetColor);
                    }}
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: presetColor,
                      cursor: 'pointer',
                      border: localColor === presetColor ? '2px solid #000' : '1px solid #ccc',
                      borderRadius: 1,
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s',
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid> */}

            <Typography sx={{ mt: 2, mb: 1 }}>Текущий цвет:</Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              padding: 1,
              border: '1px solid #ddd',
              borderRadius: 1,
              backgroundColor: '#f5f5f5'
            }}>
              <Box sx={{
                width: 50,
                height: 50,
                backgroundColor: localColor,
                borderRadius: 1,
                border: '1px solid #ccc',
                boxShadow: '0 0 4px rgba(0,0,0,0.1)',
                // Добавляем шахматный фон для прозрачных цветов
                backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%),
                                  linear-gradient(-45deg, #ccc 25%, transparent 25%),
                                  linear-gradient(45deg, transparent 75%, #ccc 75%),
                                  linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                backgroundSize: '10px 10px',
                backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px',
              }} />
              <Typography 
                sx={{ 
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  fontWeight: 'bold'
                }}
              >
                {localColor.toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ColorPickerButton;
