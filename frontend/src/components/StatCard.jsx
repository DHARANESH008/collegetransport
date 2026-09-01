import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon, color = '#3b82f6', subtitle, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: `${color}88`,
            boxShadow: `0 15px 35px -10px ${color}44, 0 0 20px ${color}22`
          }
        }}
      >
        {/* Subtle Accent Glow bar on top */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`
          }}
        />

        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: '#94a3b8',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  display: 'block',
                  mb: 0.5
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#f8fafc',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2
                }}
              >
                {value}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: `${color}20`,
                border: `1px solid ${color}44`,
                color: color,
                boxShadow: `0 0 20px ${color}33`
              }}
            >
              {icon}
            </Box>
          </Box>

          {subtitle && (
            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 500 }}>
                {subtitle}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
