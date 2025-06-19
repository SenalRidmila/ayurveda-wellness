// /screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎉 You are logged in!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#F8FFF6' },
  text: { fontSize:26, fontWeight:'bold', color:'#218838' }
});
