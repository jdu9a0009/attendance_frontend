import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, Typography, TextField } from '@mui/material';

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
  const hexToRgb = useCallback((hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  }, []);

  const rgbToHsv = useCallback((r: number, g: number, b: number): HSV => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    const s = max === 0 ? 0 : diff / max;
    const v = max;

    if (diff !== 0) {
      switch (max) {
        case r:
          h = (g - b) / diff + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / diff + 2;
          break;
        case b:
          h = (r - g) / diff + 4;
          break;
      }
      h /= 6;
    }

    return { h, s: s * 100, v: v * 100 };
  }, []);

  const hsvToRgb = useCallback((h: number, s: number, v: number): number[] => {
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
  }, []);

  const rgbToHex = useCallback((r: number, g: number, b: number): string => 
    `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`,
  []);

  const hexToHsv = useCallback((hex: string): HSV => {
    const rgb = hexToRgb(hex);
    return rgbToHsv(rgb[0], rgb[1], rgb[2]);
  }, [hexToRgb, rgbToHsv]);

  const [open, setOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const [hsv, setHsv] = useState<HSV>(() => hexToHsv(color));
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingSV, setIsDraggingSV] = useState(false);

  const hueRef = useRef<HTMLDivElement>(null);
  const svRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalColor(color);
    setHsv(hexToHsv(color));
  }, [color, hexToHsv, setLocalColor, setHsv]);

  const updateHue = useCallback((event: MouseEvent | React.MouseEvent) => {
    if (!hueRef.current) return;
  
    const rect = hueRef.current.getBoundingClientRect();
    let h = (event.clientX - rect.left) / rect.width;
    h = Math.max(0, Math.min(1, h));
  
    setHsv((prev) => {
      const newHsv = { ...prev, h };
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
      setLocalColor(hex);
      onChange(hex);
      return newHsv;
    });
  }, [hsvToRgb, rgbToHex, onChange]);
  
  const updateSV = useCallback((event: MouseEvent | React.MouseEvent) => {
    if (!svRef.current) return;
  
    const rect = svRef.current.getBoundingClientRect();
    let s = ((event.clientX - rect.left) / rect.width) * 100;
    let v = (1 - (event.clientY - rect.top) / rect.height) * 100;
  
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
  
    setHsv((prev) => {
      const newHsv = { ...prev, s, v };
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
      setLocalColor(hex);
      onChange(hex);
      return newHsv;
    });
  }, [hsvToRgb, rgbToHex, onChange]);
  

  const handleMouseDown = (event: React.MouseEvent, type: 'hue' | 'sv') => {
    if (type === 'hue') {
      setIsDraggingHue(true);
      updateHue(event);
    } else {
      setIsDraggingSV(true);
      updateSV(event);
    }
  };

  const handleMouseUp = useCallback(() => {
    setIsDraggingHue(false);
    setIsDraggingSV(false);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (isDraggingHue) {
      updateHue(event);
    }
    if (isDraggingSV) {
      updateSV(event);
    }
  }, [isDraggingHue, isDraggingSV, updateHue, updateSV]);
  
  
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        disabled={disabled}
        sx={{
          minWidth: '200px',
          justifyContent: 'space-between',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography>{label}</Typography>
        <Box
          sx={{
            width: 24,
            height: 24,
            backgroundColor: localColor,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 0.5,
          }}
        />
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change Color</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', p: 2 }}>
            {/* SV Picker */}
            <Box
              ref={svRef}
              onMouseDown={(e) => handleMouseDown(e, 'sv')}
              sx={{
                width: '100%',
                paddingTop: '100%',
                position: 'relative',
                marginBottom: 2,
                borderRadius: 1,
                cursor: 'crosshair',
                background: `
                  linear-gradient(to top, #000, transparent),
                  linear-gradient(to right, #fff, transparent),
                  linear-gradient(to right, 
                    hsl(${hsv.h * 360}deg, 100%, 50%),
                    hsl(${hsv.h * 360}deg, 100%, 50%)
                  )
                `
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  border: '2px solid white',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  left: `${hsv.s}%`,
                  top: `${100 - hsv.v}%`,
                  pointerEvents: 'none',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                }}
              />
            </Box>

            {/* Hue Slider */}
            <Box
              ref={hueRef}
              onMouseDown={(e) => handleMouseDown(e, 'hue')}
              sx={{
                width: '100%',
                height: 20,
                position: 'relative',
                borderRadius: 1,
                cursor: 'ew-resize',
                background: `linear-gradient(
                  to right,
                  #f00 0%,
                  #ff0 17%,
                  #0f0 33%,
                  #0ff 50%,
                  #00f 67%,
                  #f0f 83%,
                  #f00 100%
                )`
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: `${hsv.h * 100}%`,
                  top: '50%',
                  width: 4,
                  height: '140%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'white',
                  borderRadius: 4,
                  pointerEvents: 'none',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                }}
              />
            </Box>

            {/* Current Color Display and HEX Input */}
            <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
              <Box
                sx={{
                  width: '100%',
                  height: 40,
                  backgroundColor: localColor,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  flex: 1,
                }}
              />
              <TextField
                value={localColor}
                size="small"
                onChange={(e) => {
                  const newColor = e.target.value;
                  if (/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
                    setLocalColor(newColor);
                    setHsv(hexToHsv(newColor));
                    onChange(newColor);
                  } else if (newColor.startsWith('#') && newColor.length <= 7) {
                    setLocalColor(newColor);
                  }
                }}
                sx={{ width: '110px' }}
                inputProps={{
                  style: { textTransform: 'uppercase' }
                }}
              />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ColorPickerButton;