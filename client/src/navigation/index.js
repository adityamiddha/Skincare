import React, { useContext } from 'react';
import LoadingScreen from '../screens/LoadingScreen'; // Adjust path as needed
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { AuthContext } from '../context/AuthContext';

export default function Navigator() {
 
const { token, isLoading } = useContext(AuthContext);

if (isLoading) return <LoadingScreen />; // Or just a placeholder View

return (
  <NavigationContainer>
    {token ? <AppStack /> : <AuthStack />}
  </NavigationContainer>
);
}