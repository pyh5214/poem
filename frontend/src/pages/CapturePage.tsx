import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraCapture } from '../components/CameraCapture';
import { useAppContext } from '../context/AppContext';

const CapturePage: React.FC = () => {
  const navigate = useNavigate();
  const { setCapturedImage } = useAppContext();

  const handleCapture = (blob: Blob): void => {
    // Blob을 base64로 변환
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setCapturedImage(imageData);
      navigate('/');
    };
    reader.readAsDataURL(blob);
  };

  const handleCancel = (): void => {
    navigate('/');
  };

  return <CameraCapture onCapture={handleCapture} onCancel={handleCancel} />;
};

export default CapturePage;
