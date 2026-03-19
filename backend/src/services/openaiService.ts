import axios, { AxiosError } from 'axios';
import { config } from '../config';
import { OpenAIResponse, OpenAIMessage } from '../types';

interface OpenAIErrorResponse {
  error?: {
    message?: string;
  };
}

export interface GeneratePoemResult {
  poem: string;
}

export interface GeneratePoemError {
  errorMessage: string;
  errorDetails: string;
}

export const generatePoemFromImage = async (
  imageDataUrl: string,
  systemPrompt: string
): Promise<GeneratePoemResult> => {
  console.log('OpenAI API call starting...');
  console.log('Model:', config.openai.model, ', Prompt length:', systemPrompt.length);

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: imageDataUrl
          }
        }
      ]
    }
  ];

  const response = await axios.post<OpenAIResponse>(
    config.openai.apiUrl,
    {
      model: config.openai.model,
      messages,
      max_completion_tokens: config.openai.maxTokens
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`
      },
      timeout: config.openai.timeout
    }
  );

  console.log('OpenAI API response received');

  if (!response.data || !response.data.choices || !response.data.choices[0]) {
    console.error('OpenAI API response format error:', response.data);
    throw new Error('OpenAI API response format is invalid.');
  }

  const poem = response.data.choices[0].message.content.trim();
  console.log('Poem generation successful (length:', poem.length, 'chars)');

  return { poem };
};

export const handleOpenAIError = (error: unknown): GeneratePoemError => {
  console.error('Poem generation error occurred');

  let errorMessage = 'An error occurred while generating the poem.';
  let errorDetails = error instanceof Error ? error.message : 'Unknown error';

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<OpenAIErrorResponse>;

    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);

    if (axiosError.response) {
      console.error('Response status:', axiosError.response.status);
      console.error('Response data:', JSON.stringify(axiosError.response.data, null, 2));

      const status = axiosError.response.status;
      const responseData = axiosError.response.data;

      if (status === 401) {
        errorMessage = 'API key is invalid.';
        errorDetails = 'Please check your OpenAI API key.';
      } else if (status === 429) {
        errorMessage = 'API request limit exceeded.';
        errorDetails = 'Please try again later.';
      } else if (status === 400) {
        errorMessage = 'Invalid request.';
        errorDetails = responseData?.error?.message || error.message;
      } else if (responseData?.error?.message) {
        errorDetails = responseData.error.message;
      }
    } else if (axiosError.request) {
      console.error('Request sent but no response received');
    }

    if (axiosError.code === 'ECONNABORTED') {
      errorMessage = 'Request timed out.';
      errorDetails = 'Please check your network connection and try again.';
    } else if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
      errorMessage = 'Unable to connect to server.';
      errorDetails = 'Please check your network connection.';
    }
  } else if (error instanceof Error) {
    console.error('Error stack:', error.stack);
  }

  return { errorMessage, errorDetails };
};
