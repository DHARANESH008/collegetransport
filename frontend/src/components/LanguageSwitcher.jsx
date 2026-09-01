import React, { useState } from 'react';
import { Button, Menu, MenuItem, Box, Typography, Chip } from '@mui/material';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitcher = ({ variant = 'outlined', size = 'small' }) => {
  const { currentLang, changeLanguage } = useLanguage();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (lang) => {
    changeLanguage(lang);
    handleClose();
  };

  return (
    <Box>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        startIcon={<Globe size={16} color="#60a5fa" />}
        sx={{
          borderRadius: 3,
          px: 1.8,
          py: 0.7,
          borderColor: 'rgba(255, 255, 255, 0.15)',
          color: '#f8fafc',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)'
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
            {currentLang === 'ta' ? '🇮🇳 தமிழ்' : currentLang === 'hi' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
          </Typography>
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            mt: 1,
            backgroundColor: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
            boxShadow: '0 20px 30px rgba(0,0,0,0.5)'
          }
        }}
      >
        <MenuItem
          onClick={() => handleSelect('en')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            minWidth: 160,
            py: 1,
            backgroundColor: currentLang === 'en' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: currentLang === 'en' ? 700 : 500, color: '#f8fafc' }}>
            🇬🇧 English
          </Typography>
          {currentLang === 'en' && <Check size={16} color="#3b82f6" />}
        </MenuItem>

        <MenuItem
          onClick={() => handleSelect('ta')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            minWidth: 160,
            py: 1,
            backgroundColor: currentLang === 'ta' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: currentLang === 'ta' ? 700 : 500, color: '#f8fafc' }}>
            🇮🇳 தமிழ் (Tamil)
          </Typography>
          {currentLang === 'ta' && <Check size={16} color="#3b82f6" />}
        </MenuItem>

        <MenuItem
          onClick={() => handleSelect('hi')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            minWidth: 160,
            py: 1,
            backgroundColor: currentLang === 'hi' ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.2)' }
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: currentLang === 'hi' ? 700 : 500, color: '#f8fafc' }}>
            🇮🇳 हिंदी (Hindi)
          </Typography>
          {currentLang === 'hi' && <Check size={16} color="#3b82f6" />}
        </MenuItem>
      </Menu>
    </Box>
  );
};
