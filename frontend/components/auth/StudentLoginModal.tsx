import React from 'react';
import AuthOverlay from '../AuthOverlay';
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
  onSuccess = () => {},
  onTypeChange = () => {},
}) => {
  if (!isOpen) return null;

  return (
    <AuthOverlay
      type={type}
      setType={onTypeChange}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

export default StudentLoginModal;
