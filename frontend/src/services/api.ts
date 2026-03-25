import axios, { AxiosRequestConfig } from 'axios';
import { PoetOption } from '../types';
import { getAuthToken } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'https://rasberry-production.up.railway.app';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_URL,
  timeout: 60000,
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_token_expiry');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const generatePoem = async (
  image: Blob,
  poetOption: PoetOption
): Promise<string> => {
  const formData = new FormData();
  formData.append('image', image, 'capture.jpg');
  formData.append('option', poetOption);

  const response = await api.post<{ poem: string }>(
    '/generate-poem',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  return response.data.poem;
};

// Postcard types
export interface Postcard {
  id: string;
  title: string | null;
  poem: string;
  poetStyle: PoetOption;
  musicPrompt: string | null;
  imagePath: string | null;
  audioPath: string | null;
  duration: number | null;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostcardListResponse {
  items: Postcard[];
  total: number;
  page: number;
  limit: number;
}

export interface CreatePostcardResponse {
  postcard: Postcard;
  poem: string;
  audioData: string;
}

// Create full postcard (image -> poem -> music -> save)
export const createPostcard = async (
  imageData: string,
  poetStyle: PoetOption
): Promise<CreatePostcardResponse> => {
  const response = await api.post<CreatePostcardResponse>('/create-postcard', {
    imageData,
    poetStyle,
  });
  return response.data;
};

// Get user's postcards
export const getMyPostcards = async (
  page: number = 1,
  limit: number = 20
): Promise<PostcardListResponse> => {
  const response = await api.get<PostcardListResponse>('/postcards', {
    params: { page, limit },
  });
  return response.data;
};

// Get public postcards (gallery)
export const getPublicPostcards = async (
  page: number = 1,
  limit: number = 20
): Promise<PostcardListResponse> => {
  const response = await api.get<PostcardListResponse>('/postcards/public', {
    params: { page, limit },
  });
  return response.data;
};

// Get single postcard
export const getPostcard = async (id: string): Promise<Postcard> => {
  const response = await api.get<Postcard>(`/postcards/${id}`);
  return response.data;
};

// Delete postcard
export const deletePostcard = async (id: string): Promise<void> => {
  await api.delete(`/postcards/${id}`);
};

// Toggle postcard visibility
export const togglePostcardVisibility = async (
  id: string,
  isPublic: boolean
): Promise<void> => {
  await api.patch(`/postcards/${id}/visibility`, { isPublic });
};

// Get postcard image URL
export const getPostcardImageUrl = (id: string): string => {
  return `${API_URL}/postcards/${id}/image`;
};

// Get postcard audio URL
export const getPostcardAudioUrl = (id: string): string => {
  return `${API_URL}/postcards/${id}/audio`;
};

export default api;
