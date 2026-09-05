import React, { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  Alert,
  TextField,
  Chip
} from '@mui/material';
import { Camera, Upload, RefreshCw, CheckCircle, X, Gauge, Sparkles, Image as ImageIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';

export const SpeedometerScannerModal = ({ open, onClose, onDetectedKm, fieldName = 'Odometer' }) => {
  const [activeTab, setActiveTab] = useState(0); // 0: Camera, 1: File Upload
  const [scanning, setScanning] = useState(false);
  const [progressStatus, setProgressStatus] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [detectedKm, setDetectedKm] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Camera stream refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize camera when tab === 0 and open === true
  useEffect(() => {
    if (open && activeTab === 0 && !imagePreview) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [open, activeTab, imagePreview]);

  const startCamera = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setErrorMsg('Camera access denied or unavailable. Please use Photo Upload mode.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // Capture frame from live video feed
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setImagePreview(dataUrl);
    stopCamera();
    processImageOCR(dataUrl);
  };

  // Handle image upload from file picker
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target.result;
      setImagePreview(dataUrl);
      processImageOCR(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Process image with OCR (Tesseract.js)
  const processImageOCR = async (imageSrc) => {
    setScanning(true);
    setErrorMsg('');
    setDetectedKm('');
    setConfidence(null);
    setProgressStatus('Preprocessing Speedometer image...');

    try {
      // Step 1: Preprocess Image via Canvas to boost contrast for odometer digits
      const processedSrc = await preprocessCanvasImage(imageSrc);

      setProgressStatus('AI Scanner scanning odometer numbers...');
      const result = await Tesseract.recognize(processedSrc, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgressStatus(`Extracting KM: ${Math.round(m.progress * 100)}%`);
          }
        },
        tessedit_char_whitelist: '0123456789. KMkm'
      });

      const text = result.data.text || '';
      const conf = result.data.confidence;
      setConfidence(conf);

      // Extract numbers matching typical vehicle odometer pattern (3 to 7 digits)
      const numberMatches = text.match(/\b\d{3,7}(\.\d{1,2})?\b/g);

      if (numberMatches && numberMatches.length > 0) {
        // Pick the largest reasonable number (odometers are usually 4 to 6 digit numbers)
        const validKms = numberMatches
          .map((n) => parseFloat(n))
          .filter((n) => !isNaN(n) && n > 0 && n < 1000000);

        if (validKms.length > 0) {
          // Sort descending to find main odometer value (ignoring smaller trip meter digits if any)
          const kmVal = Math.max(...validKms);
          setDetectedKm(String(kmVal));
        } else {
          setErrorMsg('Could not clearly read odometer numbers. Please type manually or take a clearer photo.');
        }
      } else {
        // Fallback: try raw digits extraction
        const digitsOnly = text.replace(/[^\d.]/g, '');
        if (digitsOnly.length >= 3) {
          setDetectedKm(digitsOnly);
        } else {
          setErrorMsg('No odometer numbers detected in photo. Please ensure numbers are brightly lit and centered.');
        }
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setErrorMsg('Failed to process image. Please enter KM manually.');
    } finally {
      setScanning(false);
      setProgressStatus('');
    }
  };

  // Image Preprocessor: Convert image to high-contrast grayscale for digital/analog speedometers
  const preprocessCanvasImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Grayscale + Contrast Enhancement algorithm
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          // Apply high contrast threshold
          const v = avg > 120 ? 255 : 0;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg'));
      };
      img.onerror = () => resolve(src);
      img.src = src;
    });
  };

  const handleRetake = () => {
    setImagePreview(null);
    setDetectedKm('');
    setErrorMsg('');
    if (activeTab === 0) startCamera();
  };

  const handleConfirm = () => {
    if (detectedKm) {
      onDetectedKm(parseFloat(detectedKm));
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    stopCamera();
    setImagePreview(null);
    setDetectedKm('');
    setErrorMsg('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth paperProps={{ sx: { borderRadius: 4, backgroundColor: '#0f172a' } }}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#f8fafc', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 2.5, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff' }}>
            <Gauge size={22} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            📷 Speedometer AI Scanner ({fieldName})
          </Typography>
        </Box>
        <IconButton onClick={handleCloseModal} sx={{ color: '#94a3b8' }}>
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => {
            setActiveTab(val);
            setImagePreview(null);
          }}
          variant="fullWidth"
          sx={{ mb: 2.5, '& .MuiTab-root': { fontWeight: 800, borderRadius: 2 } }}
        >
          <Tab icon={<Camera size={18} />} label="Live Camera" iconPosition="start" />
          <Tab icon={<Upload size={18} />} label="Upload Photo" iconPosition="start" />
        </Tabs>

        {errorMsg && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2.5 }}>
            {errorMsg}
          </Alert>
        )}

        {/* MODE 1: Camera Feed or Preview */}
        {!imagePreview ? (
          activeTab === 0 ? (
            <Box sx={{ position: 'relative', width: '100%', height: 320, borderRadius: 3, overflow: 'hidden', backgroundColor: '#020617', border: '2px dashed #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {/* Odometer Scanner Frame Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '80%',
                  height: 120,
                  border: '3px solid #34d399',
                  borderRadius: 3,
                  boxShadow: '0 0 20px rgba(52, 211, 153, 0.6), inset 0 0 15px rgba(52, 211, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}
              >
                <Chip
                  label="POSITION SPEEDOMETER NUMBERS HERE"
                  size="small"
                  sx={{ backgroundColor: 'rgba(16, 185, 129, 0.9)', color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}
                />
              </Box>

              <Button
                variant="contained"
                color="success"
                size="large"
                startIcon={<Camera size={20} />}
                onClick={capturePhoto}
                sx={{ position: 'absolute', bottom: 16, borderRadius: 4, fontWeight: 900, px: 3, py: 1.2, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.5)' }}
              >
                CAPTURE & SCAN
              </Button>
            </Box>
          ) : (
            <Box
              component="label"
              sx={{
                width: '100%',
                height: 220,
                borderRadius: 3,
                border: '2px dashed #3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.12)' }
              }}
            >
              <input type="file" accept="image/*" capture="environment" hidden onChange={handleFileChange} />
              <ImageIcon size={48} color="#60a5fa" />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#f8fafc', mt: 1.5 }}>
                Click to Choose Speedometer Photo
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                Supports PNG, JPG, WEBP from camera or gallery
              </Typography>
            </Box>
          )
        ) : (
          /* Captured Photo & AI OCR Result Preview */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ position: 'relative', width: '100%', height: 220, borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <img src={imagePreview} alt="Speedometer Odometer" style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#020617' }} />
              <Button
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<RefreshCw size={14} />}
                onClick={handleRetake}
                sx={{ position: 'absolute', top: 10, right: 10, borderRadius: 2, fontWeight: 700 }}
              >
                Retake
              </Button>
            </Box>

            {scanning ? (
              <Box sx={{ p: 2.5, borderRadius: 3, backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={26} color="info" />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#60a5fa' }}>
                    Reading Speedometer Odometer...
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
                    {progressStatus}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 2.5, borderRadius: 3, backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="caption" sx={{ color: '#34d399', fontWeight: 800, letterSpacing: '0.05em' }}>
                    ✨ AI DETECTED ODOMETER KM
                  </Typography>
                  {confidence && (
                    <Chip
                      label={`Confidence: ${Math.round(confidence)}%`}
                      size="small"
                      color={confidence > 60 ? 'success' : 'warning'}
                      sx={{ fontWeight: 800, borderRadius: 1.5 }}
                    />
                  )}
                </Box>

                <TextField
                  fullWidth
                  size="small"
                  label="Detected Odometer KM (Editable)"
                  value={detectedKm}
                  onChange={(e) => setDetectedKm(e.target.value)}
                  placeholder="Enter or adjust KM"
                  sx={{
                    '& .MuiInputBase-input': { fontSize: '1.4rem', fontWeight: 900, color: '#34d399' }
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={handleCloseModal} sx={{ color: '#94a3b8', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="success"
          disabled={!detectedKm || scanning}
          onClick={handleConfirm}
          startIcon={<CheckCircle size={18} />}
          sx={{ borderRadius: 3, fontWeight: 900, px: 3, py: 1 }}
        >
          USE THIS KM ({detectedKm || '0'} KM)
        </Button>
      </DialogActions>
    </Dialog>
  );
};
