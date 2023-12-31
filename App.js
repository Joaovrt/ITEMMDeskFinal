import React from 'react';
import { StatusBar } from 'react-native';
import { UserProvider } from './src/contexts/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

export default function App() {
  return (
  <UserProvider>
    <NavigationContainer>
      <StatusBar backgroundColor="#263868" barStyle="light-content" />
      <Routes/>
    </NavigationContainer>
  </UserProvider>
  );
}

