import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/pages/login/LoginScreen';
import RegisterScreen from './src/pages/register/RegisterScreen';
import HomeScreen from './src/pages/home/HomeScreen';
import RegisterBookScreen from './src/pages/book/register/RegisterBookScreen';
import MyBooksScreen from './src/pages/book/myBooks/MyBooksScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: 'Cadastro' }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
        <Stack.Screen name="RegisterBookScreen" component={RegisterBookScreen} options={{ title: 'RegisterBookScreen' }} />
        <Stack.Screen name="MyBooksScreen" component={MyBooksScreen} options={{ title: 'MyBooksScreen' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
