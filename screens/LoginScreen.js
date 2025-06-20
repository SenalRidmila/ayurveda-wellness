import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';

const useProxy = true;
const redirectUri = AuthSession.makeRedirectUri({ useProxy });

const CLIENT_ID = "306656960463-vjlm3b1qmsk5su10ad6g4e46esgn9vl2.apps.googleusercontent.com";

const DISCOVERY = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke"
};

export default function LoginScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true);

    // Print the actual redirectUri to terminal
    console.log("REDIRECT URI:", redirectUri);

    const authUrl =
      `${DISCOVERY.authorizationEndpoint}?client_id=${CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token&scope=profile%20email`;

    const response = await AuthSession.startAsync({ authUrl });

    if (response.type === 'success') {
      let userResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${response.params.access_token}` }
      });
      const user = await userResponse.json();
      setUserInfo(user);
      // Navigate to Home on successful login
      navigation.replace('Home', { user });
    } else {
      setUserInfo(null);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      {userInfo ? (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.picture }} style={styles.avatar} />
          <Text style={styles.text}>Welcome, {userInfo.name}</Text>
          <Text style={styles.email}>{userInfo.email}</Text>
        </View>
      ) : (
        <Button
          title={loading ? "Signing In..." : "Sign in with Google"}
          onPress={signInWithGoogle}
          disabled={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 32 },
  userInfo: { alignItems: 'center', marginTop: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
  text: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  email: { fontSize: 14, color: 'gray' }
});
