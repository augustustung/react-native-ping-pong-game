import React from 'react';
import { View } from 'react-native';

export default Ball = ({ size, ball }) => {
  return (
    <View 
      style={{
        width: size, 
        height: size, 
        top: ball[0],
        right: ball[1], 
        position: 'absolute',
        backgroundColor: '#fff',
        borderRadius: 100
      }}
    />
  )
}