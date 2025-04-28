import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';
import { useTheme } from '@mui/material/styles';

export interface ConfirmationModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  itemType?: string;
  isDeleting?: boolean;
  isConfirming?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function ConfirmationModal({
  isOpen,
  open,
  onClose,
  onCancel,
  onConfirm,
  title = 'Confirmar Exclusão',
  message,
  itemName,
  itemType = 'item',
  isDeleting = false,
  isConfirming = false,
  confirmButtonText = 'Excluir',
  cancelButtonText = 'Cancelar',
}: ConfirmationModalProps) {
  const theme = useTheme();

  // Compatibilidade com ambas as props
  const isModalOpen = isOpen || open || false;
  const handleClose = onClose || onCancel || (() => {});
  const isLoading = isDeleting || isConfirming || false;

  // Montar mensagem padrão se não for fornecida
  const dialogMessage =
    message ||
    (itemName
      ? `Tem certeza que deseja excluir o ${itemType} "${itemName}"? Esta ação não poderá ser desfeita.`
      : 'Tem certeza que deseja prosseguir? Esta ação não poderá ser desfeita.');

  return (
    <Dialog open={isModalOpen} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          <Box
            className="bg-kai-primary/10"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(37, 99, 235, 0.1)',
              borderRadius: '50%',
              padding: 2,
            }}
          >
            <AlertTriangle size={28} className="text-kai-primary" />
          </Box>
        </Box>
        <Typography
          component="div"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            fontSize: '1.25rem',
          }}
        >
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: theme.palette.text.secondary }}
        >
          {dialogMessage}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            padding: 1,
            gap: 1,
          }}
        >
          <Button
            onClick={handleClose}
            disabled={isLoading}
            sx={(theme) => ({
              backgroundColor:
                theme.palette.mode === 'light' ? '#fff' : '#0b0e14',
              border: '1px solid #e5e7eb',
            })}
            className="text-kai-primary transition-colors hover:bg-kai-primary/10"
          >
            <Typography>{cancelButtonText}</Typography>
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-kai-primary hover:bg-kai-primary/70"
          >
            <Typography
              sx={(theme) => ({
                color: theme.palette.mode === 'light' ? '#fff' : '#000',
              })}
            >
              {isLoading ? 'Processando...' : confirmButtonText}
            </Typography>
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
