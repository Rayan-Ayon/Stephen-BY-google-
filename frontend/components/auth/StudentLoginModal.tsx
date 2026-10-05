import React, { useEffect } from 'react';
import { AuthType } from '../../App';

export interface StudentLoginModalProps {
  type?: 'login' | 'signup';
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: (email: string) => void;
  onTypeChange?: (type: AuthType) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  type = 'login',
  isOpen = true,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      const target = type === 'signup' ? '/signup' : '/login';
      window.history.pushState({}, '', target);
      window.dispatchEvent(new PopStateEvent('popstate'));
      onClose();
    }
  }, [isOpen, type, onClose]);

  return null;
};

export default StudentLoginModal;
