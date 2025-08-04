import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import authApi from '../api/authApi';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSignup = async () => {
    try {
      const response = await authApi.signup(name, email, password);
      login(response.token); // Save token and move to Home
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Signup Failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: 'center' },
  title: { fontSize: 28, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginVertical: 8, borderRadius: 8 },
  button: { backgroundColor: '#09F', padding: 14, borderRadius: 8, marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});