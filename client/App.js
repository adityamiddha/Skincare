import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import Navigator from './src/navigation';

export default function App() {
  return (
    <AuthProvider>
      <Navigator />
    </AuthProvider>
  );
}