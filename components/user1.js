import React from 'react';
import { View } from 'react-native';

export default User1 = ({ width, height, user1}) => {
  return (
    <View 
      style={{
        width: width, 
        height: height, 
        top: user1[0], 
        right: user1[1],
        position: 'absolute',
        backgroundColor: '#fff',
      }}
    />
  )
}