
import React from 'react';

// Added Category interface to fix the import error in constants.tsx
export interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export interface Topic {
  id: string;
  title: string;
  videoUrl: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  price: number;
  rating: number;
  duration: string;
  image: string;
  videoUrl?: string; // Main trailer/intro
  topics: Topic[];
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  image: string;
  verified: boolean;
}
