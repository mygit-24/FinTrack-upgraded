// src/components/layout/Layout.jsx
import React from 'react';
import Header from '../ui/Header';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <div className='app-root'>
      <Header />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
