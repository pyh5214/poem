export interface SavedPostcard {
  id: string;
  imageData: string;
  poem: string;
  poetStyle: string;
  createdAt: string;
}

const STORAGE_KEY = 'saved_postcards';
const MAX_POSTCARDS = 50;

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const savePostcard = (postcard: Omit<SavedPostcard, 'id' | 'createdAt'>): SavedPostcard => {
  const postcards = getPostcards();

  const newPostcard: SavedPostcard = {
    ...postcard,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  postcards.unshift(newPostcard);

  // 최대 개수 초과시 오래된 것 삭제
  if (postcards.length > MAX_POSTCARDS) {
    postcards.splice(MAX_POSTCARDS);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(postcards));
  } catch (error) {
    console.error('Failed to save postcard:', error);
    // 용량 초과시 오래된 것 더 삭제
    if (postcards.length > 10) {
      postcards.splice(10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(postcards));
    }
  }

  return newPostcard;
};

export const getPostcards = (): SavedPostcard[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get postcards:', error);
    return [];
  }
};

export const getPostcard = (id: string): SavedPostcard | undefined => {
  const postcards = getPostcards();
  return postcards.find(p => p.id === id);
};

export const deletePostcard = (id: string): void => {
  const postcards = getPostcards();
  const filtered = postcards.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const clearAllPostcards = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getPostcardCount = (): number => {
  return getPostcards().length;
};
