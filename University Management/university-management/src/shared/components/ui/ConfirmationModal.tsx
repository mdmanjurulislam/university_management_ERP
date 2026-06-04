import React from 'react';
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalTitle, 
  ModalDescription,
  ModalFooter 
} from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="max-w-md">
        <ModalHeader className="flex flex-col items-center text-center gap-2">
          <div className={`p-3 rounded-full ${
            variant === 'danger' ? 'bg-red-50 text-red-600' : 
            variant === 'warning' ? 'bg-amber-50 text-amber-600' : 
            'bg-blue-50 text-blue-600'
          }`}>
            <AlertTriangle size={28} />
          </div>
          <ModalTitle className="text-xl">{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
        
        <ModalFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'destructive' : 'default'} 
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1 rounded-xl shadow-lg shadow-red-100"
          >
            {confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
