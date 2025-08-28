import React, { useState } from 'react';
import {router} from 'expo-router';
import axios from 'axios';
import ProtectedRoute from '../components/ProtectedRoute';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
 const [role, setRole] = useState(''); 

  const handleSignUP = async () => {
    try {
      const response = await axios.post('http://localhost:5001/app/api/Signup', {
        name,
        email,
        password,
      });

      
      console.log('Signup success:', response.data);
      alert('Signup successful!');
      setName('');
      setPassword('');
      setEmail('');
    } catch (err) {
      console.error('Signup failed:', err.response?.data || err.message);
      alert('Signup failed');
    }
  };

  
  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5001/app/api/Login',
        {
          email,
          password,
        }
      );
     const userId = response.data.userId;
     console.log('User ID:', userId);
     const accesstoken = response.data.accessToken;
     const  refreshtoken = response.data.refreshToken;
    if (accesstoken) {
      await AsyncStorage.setItem('accesstoken', accesstoken);
      await AsyncStorage.setItem('refreshtoken',  refreshtoken);
      await AsyncStorage.setItem('userId', userId);
      console.log('Access Token stored:', accesstoken);
      console.log('Refresh Token stored:', refreshtoken);
      setName('');
      setPassword('');
      homepage();
      setModalVisible(false);
    } else {
      alert('Login failed: No token returned');
    }
    } catch (err) {
      setLoginStatus('fail');
      console.error('Login failed:', err.response?.data || err.message);
      setPassword('');
       
    }
  };
  const homepage = async () => {

    try {
      const token = await AsyncStorage.getItem('accesstoken');

      const response = await axios.post('http://localhost:5001/app/api/home', { 
      }, {
       
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      router.push('/HomeScreen')
    } catch (err) {
      console.error('token expired:', err.response?.data || err.message);
      
      router.push('/')
      alert('Token has expired');
    }
  };

  return (
    <View style={styles.container}>
    
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.Button} onPress={()=>{ handleSignUP()}
      }>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.Button, { backgroundColor: '#28a745' }]}
        onPress={() => {
          setLoginStatus('');
          setModalVisible(true);
            
        }}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
      >
        <View style={styles.container}>
          <Text style={{ fontSize: 20, marginBottom: 20 }}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.Button}
            onPress={() => {
              handleLogin();
            }}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.Button}
            onPress={() => { setModalVisible(false)}
            }
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  Button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successText: {
    color: 'green',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  failText: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Index;
