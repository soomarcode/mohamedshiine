
import React from 'react';
import { 
  Rocket, 
  Cpu, 
  PieChart, 
  Feather, 
  Globe,
  Briefcase,
  Languages,
  Stethoscope,
  Camera
} from 'lucide-react';
import { Category, Course, Mentor } from './types.ts';

export const CATEGORIES: Category[] = [
  { id: 'cat_biz', name: 'Ganacsiga', icon: <Briefcase />, color: 'bg-blue-50 text-blue-500' },
  { id: 'cat_code', name: 'Code-ka', icon: <Cpu />, color: 'bg-emerald-50 text-emerald-500' },
  { id: 'cat_design', name: 'Naqshadaynta', icon: <Feather />, color: 'bg-rose-50 text-rose-500' },
  { id: 'cat_data', name: 'Xogta', icon: <PieChart />, color: 'bg-amber-50 text-amber-500' },
  { id: 'cat_marketing', name: 'Suuq-geynta', icon: <Globe />, color: 'bg-sky-50 text-sky-500' },
  { id: 'cat_lang', name: 'Luuqadaha', icon: <Languages />, color: 'bg-purple-50 text-purple-500' },
  { id: 'cat_health', name: 'Caafimaadka', icon: <Stethoscope />, color: 'bg-red-50 text-red-500' },
  { id: 'cat_photo', name: 'Sawirka', icon: <Camera />, color: 'bg-orange-50 text-orange-500' },
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Hoggaaminta Fulinta & Maareynta Isbeddelka Ganacsiga',
    category: 'GANACSIGA',
    categoryId: 'cat_biz',
    price: 99.00,
    rating: 4.9,
    duration: '14h 20m',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    topics: [
      { id: 't1', title: 'Hordhaca Maamulka', videoUrl: 'https://youtu.be/dQw4w9WgXcQ' },
      { id: 't2', title: 'Istaraatiijiyadda Ganacsiga', videoUrl: 'https://youtu.be/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 'c2',
    title: 'Python for Data Science: Min Bilow ilaa Pro',
    category: 'CODE-KA',
    categoryId: 'cat_code',
    price: 125.00,
    rating: 4.8,
    duration: '32h 45m',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    topics: [
      { id: 'p1', title: 'Syntax-ka Python', videoUrl: 'https://youtu.be/dQw4w9WgXcQ' },
      { id: 'p2', title: 'Pandas & Dataframes', videoUrl: 'https://youtu.be/dQw4w9WgXcQ' }
    ]
  },
  {
    id: 'c3',
    title: 'Naqshadaynta UI/UX ee App-yada Casriga ah',
    category: 'NAQSHADAYNTA',
    categoryId: 'cat_design',
    price: 85.00,
    rating: 4.7,
    duration: '22h 10m',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=400',
    topics: []
  }
];

export const MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Eng. Cabdi Nuur',
    title: 'Software Architect',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    verified: true
  }
];
