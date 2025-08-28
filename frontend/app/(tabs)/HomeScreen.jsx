import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen() {
  const API_URL = "http://localhost:5001/app/api";

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editData, setEditData] = useState(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("accessToken");
      const userId = await AsyncStorage.getItem("userId");
      const res = await axios.get(`${API_URL}/patients`, {
        params: { userId: userId },
      });
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const openDetail = (patient) => {
    setSelectedPatient(patient);
  };

  const openEdit = () => {
    setEditData(JSON.parse(JSON.stringify(selectedPatient)));
    setSelectedPatient(null);
  };

  const handleDelete = async (patientId) => {
    try {
      await axios.delete(`${API_URL}/patient/${patientId}`);
      alert("Patient deleted successfully");
      setSelectedPatient(null);
      fetchPatients();
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert("Failed to delete patient.");
    }
  };

  const handleSave = async () => {
    try {
      const patientId = editData._id;

      const res = await axios.put(
        `${API_URL}/patient/${patientId}/updateRecords`,
        {
          name: editData.name,
          age: editData.age,
          gender: editData.gender,
          doctor: editData.doctors[0],
          hospital: editData.hospitals[0],
          illness: editData.illnesses[0],
        }
      );

      alert("Record updated!");
      setEditData(null);
      fetchPatients();
    } catch (error) {
      console.error("Error saving record:", error);
      alert("Failed to save changes.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patients</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={patients}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => openDetail(item)}
            >
              <Text style={styles.cardTitle}>
                {item.illnesses?.length > 0
                  ? item.illnesses[0].diagnosis
                  : "No illness recorded"}
              </Text>
              <Text style={styles.cardDate}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

 
      <Modal visible={!!selectedPatient} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          {selectedPatient && (
            <>
              <Text style={styles.modalTitle}>Patient Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name:</Text>
                <Text style={styles.detailValue}>
                  {selectedPatient.name}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Age:</Text>
                <Text style={styles.detailValue}>
                  {selectedPatient.age}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gender:</Text>
                <Text style={styles.detailValue}>
                  {selectedPatient.gender}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Doctors</Text>
              {selectedPatient.doctors?.map((doc, i) => (
                <View key={i} style={styles.detailBox}>
                  <Text>Doctor: {doc.name}</Text>
                  <Text>Specialization: {doc.spec}</Text>
                  <Text>Id Issue: {doc.regno}</Text>
                  <Text>Contact: {doc.doccontact}</Text>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Hospitals</Text>
              {selectedPatient.hospitals?.map((hos, i) => (
                <View key={i} style={styles.detailBox}>
                  <Text>Hospital: {hos.name}</Text>
                  <Text>Address: {hos.address}</Text>
                  <Text>Contact: {hos.contact}</Text>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Illnesses</Text>
              {selectedPatient.illnesses?.map((ill, i) => (
                <View key={i} style={styles.detailBox}>
                  <Text>Diagnosis: {ill.diagnosis}</Text>
                  <Text>Treatment: {ill.treatment}</Text>
                  <Text>Symptoms: {ill.symptoms}</Text>
                  <Text>Prescribed Med: {ill.prescribedmed}</Text>
                  <Text>Prescribed Time: {ill.prescribedtime}</Text>
                  <Text>Recovery Time: {ill.recoverytime}</Text>
                  <Text>Surgery: {ill.surgery}</Text>
                  <Text>Sur. Details: {ill.surdetails}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={[styles.button, styles.updateButton]}
                onPress={openEdit}
              >
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDelete(selectedPatient._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setSelectedPatient(null)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Modal>

      
      <Modal visible={!!editData} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          {editData && (
            <>
              <Text style={styles.modalTitle}>Edit Patient</Text>

              <TextInput
                style={styles.input}
                value={editData.name}
                placeholder="Name"
                onChangeText={(text) =>
                  setEditData({ ...editData, name: text })
                }
              />
              <TextInput
                style={styles.input}
                value={editData.age?.toString()}
                placeholder="Age"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setEditData({ ...editData, age: Number(text) })
                }
              />
              <TextInput
                style={styles.input}
                value={editData.gender}
                placeholder="Gender"
                onChangeText={(text) =>
                  setEditData({ ...editData, gender: text })
                }
              />

              <Text style={styles.sectionTitle}>Doctors</Text>
              {editData.doctors?.map((doc, index) => (
                <View key={index} style={styles.subCard}>
                  <TextInput
                    style={styles.input}
                    value={doc.name}
                    placeholder="Doctor Name"
                    onChangeText={(text) => {
                      const updated = [...editData.doctors];
                      updated[index] = { ...updated[index], name: text };
                      setEditData({ ...editData, doctors: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={doc.spec}
                    placeholder="Specialization"
                    onChangeText={(text) => {
                      const updated = [...editData.doctors];
                      updated[index] = { ...updated[index], spec: text };
                      setEditData({ ...editData, doctors: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={doc.regno}
                    placeholder="Id Issue"
                    onChangeText={(text) => {
                      const updated = [...editData.doctors];
                      updated[index] = { ...updated[index], regno: text };
                      setEditData({ ...editData, doctors: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={doc.doccontact}
                    placeholder="Contact"
                    onChangeText={(text) => {
                      const updated = [...editData.doctors];
                      updated[index] = { ...updated[index], doccontact: text };
                      setEditData({ ...editData, doctors: updated });
                    }}
                  />
                </View>
              ))}

              <Text style={styles.sectionTitle}>Hospitals</Text>
              {editData.hospitals?.map((hos, index) => (
                <View key={index} style={styles.subCard}>
                  <TextInput
                    style={styles.input}
                    value={hos.name}
                    placeholder="Hospital Name"
                    onChangeText={(text) => {
                      const updated = [...editData.hospitals];
                      updated[index] = { ...updated[index], name: text };
                      setEditData({ ...editData, hospitals: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={hos.address}
                    placeholder="Hospital Address"
                    onChangeText={(text) => {
                      const updated = [...editData.hospitals];
                      updated[index] = { ...updated[index], address: text };
                      setEditData({ ...editData, hospitals: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={hos.contact}
                    placeholder="Hospital Contact"
                    onChangeText={(text) => {
                      const updated = [...editData.hospitals];
                      updated[index] = { ...updated[index], contact: text };
                      setEditData({ ...editData, hospitals: updated });
                    }}
                  />
                </View>
              ))}

              <Text style={styles.sectionTitle}>Illnesses</Text>
              {editData.illnesses?.map((ill, index) => (
                <View key={index} style={styles.subCard}>
                  <TextInput
                    style={styles.input}
                    value={ill.symptoms}
                    placeholder="Symptoms"
                    onChangeText={(text) => {
                      const updated = [...editData.illnesses];
                      updated[index] = { ...updated[index], symptoms: text };
                      setEditData({ ...editData, illnesses: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={ill.diagnosis}
                    placeholder="Diagnosis"
                    onChangeText={(text) => {
                      const updated = [...editData.illnesses];
                      updated[index] = { ...updated[index], diagnosis: text };
                      setEditData({ ...editData, illnesses: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={ill.treatment}
                    placeholder="Treatment"
                    onChangeText={(text) => {
                      const updated = [...editData.illnesses];
                      updated[index] = { ...updated[index], treatment: text };
                      setEditData({ ...editData, illnesses: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={ill.prescribedmed}
                    placeholder="Prescribed Medicine"
                    onChangeText={(text) => {
                      const updated = [...editData.illnesses];
                      updated[index] = { ...updated[index], prescribedmed: text };
                      setEditData({ ...editData, illnesses: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={ill.prescribedtime}
                    placeholder="Prescribed Time"
                    onChangeText={(text) => {
                      const updated = [...editData.illnesses];
                      updated[index] = {
                        ...updated[index],
                        prescribedtime: text,
                      };
                      setEditData({ ...editData, illnesses: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={ill.recoverytime}
                    placeholder="Recovery Time"
                    onChangeText={(text) => {
                      const updated = [...editData.illnesses];
                      updated[index] = { ...updated[index], recoverytime: text };
                      setEditData({ ...editData, illnesses: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={ill.surgery}
                    placeholder="Surgery"
                    onChangeText={(text) => {
                      const updated = [...editData.illnesses];
                      updated[index] = { ...updated[index], surgery: text };
                      setEditData({ ...editData, illnesses: updated });
                    }}
                  />
                  <TextInput
                    style={styles.input}
                    value={ill.surdetails}
                    placeholder="Surgery Details"
                    onChangeText={(text) => {
                      const updated = [...editData.illnesses];
                      updated[index] = { ...updated[index], surdetails: text };
                      setEditData({ ...editData, illnesses: updated });
                    }}
                  />
                </View>
              ))}

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditData(null)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f1f5f9" },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1e293b",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: "600", color: "#0f172a" },
  cardDate: { fontSize: 14, color: "#475569", marginTop: 6 },

  modalContainer: {
    backgroundColor: "#f8fafc",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: "100%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e293b",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#0369a1",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  detailLabel: { fontWeight: "600", color: "#334155" },
  detailValue: { color: "#0f172a", flexShrink: 1, textAlign: "right" },

  detailBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  subCard: {
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    fontSize: 15,
  },

  button: {
    padding: 15,
    borderRadius: 12,
    marginTop: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },

  saveButton: { backgroundColor: "#22c55e" },
  updateButton: { backgroundColor: "#2563eb" },
  deleteButton: { backgroundColor: "#ef4444" },
  cancelButton: { backgroundColor: "#64748b" },
});
