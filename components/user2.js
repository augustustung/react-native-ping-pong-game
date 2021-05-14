import React from 'react';
import { View } from 'react-native';

export default User2 = ({ width, height, user2}) => {
  return (
    <View 
      style={{
        width: width, 
        height: height, 
        top: user2[0], 
        right: user2[1],
        position: 'absolute',
        backgroundColor: '#fff',
      }}
    />
  )
}