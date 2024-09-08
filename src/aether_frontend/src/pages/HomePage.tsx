
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import Home from '@/features/home';

const HomePage: React.FC = () => {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
};

export default HomePage;