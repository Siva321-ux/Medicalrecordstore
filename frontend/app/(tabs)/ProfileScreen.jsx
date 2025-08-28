import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5001/app/api";

const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) return alert("No user logged in");

      const res = await axios.get(`${API_URL}/user/${userId}/profile`);
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching profile:", err.response?.data || err.message);
      alert("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const logout = async () => {
    try {
      await AsyncStorage.clear();
      router.push('/')
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message);
      alert('LogOut failed');
    }
  };

  if (loading || !profile) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{profile.user.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{profile.user.email}</Text>

        <Text style={styles.label}>Created At:</Text>
        <Text style={styles.value}>
          {new Date(profile.user.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.subTitle}>Records Count</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profile.stats.patients}</Text>
          <Text style={styles.statLabel}>Patients</Text>
        </View>
      </View>
      <TouchableOpacity  style={styles.button}onPress={()=>logout()}><Text style={styles.buttonText}>Log out</Text></TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  label: { fontWeight: "600", color: "#334155", marginTop: 8 },
  value: { color: "#0f172a", fontSize: 15 },
  subTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0369a1",
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: { fontSize: 22, fontWeight: "700", color: "#2563eb" },
  statLabel: { fontSize: 14, color: "#475569" },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

