import axios from 'axios';
import { PoetOption } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'https://rasberry-production.up.railway.app';

export const generatePoem = async (
  image: Blob,
  poetOption: PoetOption
): Promise<string> => {
  const formData = new FormData();
  formData.append('image', image, 'capture.jpg');
  formData.append('option', poetOption);

  const response = await axios.post<{ poem: string }>(
    `${API_URL}/generate-poem`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000
    }
  );

  return response.data.poem;
};
