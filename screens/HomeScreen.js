// src/screens/HomeScreen.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome back, John Doe</Text>
          <Text style={styles.sub}>How can we help you today?</Text>
        </View>
        {/* (Optional) Bell & Settings */}
        <View style={{flexDirection:'row', gap:20, alignItems:'center'}}>
          <MaterialIcons name="notifications-none" size={24} color="#1fa45b" />
          <MaterialIcons name="settings" size={24} color="#1fa45b" />
        </View>
      </View>

      <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:30}}>
        {/* Language selector */}
        <View style={styles.languageBox}>
          <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
            <MaterialCommunityIcons name="web" size={22} color="#1fa45b" />
            <Text style={styles.languageText}>Language: English</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.changeBtn}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* Features */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('AISymptomChecker')}
        >
          <View style={styles.iconCircleBlue}>
            <MaterialCommunityIcons name="robot-outline" size={34} color="#3a84fa" />
          </View>
          <View>
            <Text style={styles.cardTitle}>AI Symptom Checker</Text>
            <Text style={styles.cardDesc}>Get personalized health insights</Text>
          </View>
          <MaterialIcons name="chevron-right" size={28} color="#36b37e" style={{marginLeft:'auto'}} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Remedies')}
        >
          <View style={styles.iconCircleGreen}>
            <MaterialCommunityIcons name="leaf" size={34} color="#35c759" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Ayurvedic Remedies</Text>
            <Text style={styles.cardDesc}>Natural healing solutions</Text>
          </View>
          <MaterialIcons name="chevron-right" size={28} color="#36b37e" style={{marginLeft:'auto'}} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('Doctors')}
        >
          <View style={styles.iconCircleYellow}>
            <FontAwesome5 name="stethoscope" size={30} color="#ffd560" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Find Doctors</Text>
            <Text style={styles.cardDesc}>Book appointments with experts</Text>
          </View>
          <MaterialIcons name="chevron-right" size={28} color="#36b37e" style={{marginLeft:'auto'}} />
        </TouchableOpacity>

        {/* Daily Wellness Tip */}
        <View style={styles.tipBox}>
          <View style={{flexDirection:'row', alignItems:'center', marginBottom:3}}>
            <MaterialIcons name="favorite-border" size={22} color="#e09533" />
            <Text style={styles.tipTitle}>  Daily Wellness Tip</Text>
          </View>
          <Text style={styles.tipDesc}>
            Start your day with warm water and lemon to boost digestion and detoxification.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5fef6', paddingHorizontal:16, paddingTop:38 },
  header: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:18 },
  welcome: { fontSize:23, fontWeight:'bold', color:'#209f51' },
  sub: { fontSize:17, color:'#49ab7e', marginTop:2 },
  languageBox: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#fff', borderRadius:11, marginBottom:14, padding:16, borderWidth:1, borderColor:'#d3f3e3' },
  languageText: { fontSize:15, color:'#179349', fontWeight:'500' },
  changeBtn: { color:'#209f51', fontWeight:'bold', fontSize:15 },
  card: { flexDirection:'row', alignItems:'center', backgroundColor:'#fff', borderRadius:11, marginBottom:15, padding:18, borderWidth:1, borderColor:'#d1f2e2', minHeight:68 },
  cardTitle: { fontSize:17, fontWeight:'bold', color:'#179349' },
  cardDesc: { fontSize:14, color:'#49ab7e', marginTop:1, marginBottom:2 },
  iconCircleBlue: { width:48, height:48, borderRadius:24, backgroundColor:'#eaf1ff', alignItems:'center', justifyContent:'center', marginRight:16 },
  iconCircleGreen: { width:48, height:48, borderRadius:24, backgroundColor:'#e7faee', alignItems:'center', justifyContent:'center', marginRight:16 },
  iconCircleYellow: { width:48, height:48, borderRadius:24, backgroundColor:'#fff9e7', alignItems:'center', justifyContent:'center', marginRight:16 },
  tipBox: { backgroundColor:'#fffaeb', borderRadius:11, borderWidth:1, borderColor:'#ffecc3', padding:14, marginTop:10 },
  tipTitle: { fontWeight:'bold', color:'#e09533', fontSize:16 },
  tipDesc: { fontSize:14, color:'#b07631', marginLeft:5 }
});
