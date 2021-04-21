import React from 'react';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import colors from '../styles/colors';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import fonts from '../styles/fonts';

interface HeaderProps {
  userName: string;
  userImage: string;
}

export function Header({userName, userImage}: HeaderProps) {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <Image style={styles.userImage} source={{uri: userImage}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: Platform.OS === 'ios' ? getStatusBarHeight() : 0,
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  userName: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 40,
  },
  userImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
});
