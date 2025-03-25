import React, { useEffect } from 'react';
import styles from '../styles/SuccessModal.module.css';
import { FaCheckCircle } from 'react-icons/fa';

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <FaCheckCircle className={styles.icon} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default SuccessModal; 