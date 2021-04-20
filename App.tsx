import React, {useEffect} from 'react';
import {Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  useEffect(() => {
    console.log('entrou');
    SplashScreen.hide();
  }, []);

  return <Text>aa</Text>;
};

export default App;
