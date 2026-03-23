import { Poet } from '../types';

export const POETS: Poet[] = [
  { value: 'A', label: '서정적 스타일', description: '감성과 운율이 돋보이는 전통 서정시' },
  { value: 'B', label: '이미지즘 스타일', description: '선명한 이미지와 감각적 묘사' },
  { value: 'C', label: '모더니즘 스타일', description: '실험적이고 전위적인 표현' },
  { value: 'D', label: 'SNS 스타일', description: '짧고 위트있는 현대적 감성' }
];

export const getPoetStyleLabel = (value: string): string => {
  const poet = POETS.find(p => p.value === value);
  return poet?.label || '알 수 없는 스타일';
};
