import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RecordPage() {
  
  const initialFormData = {
    patient: { name: "", age: "", gender: "" },
    doctor: { name: "", spec: "", regno: "", doccontact: "" },
    hospital: { name: "", address: "", contact: "" },
    illness: {
      symptoms: "",
      diagnosis: "",
      treatment: "",
      prescribedmed: "",
      prescribedtime: "",
      recoverytime: "",
      surgery: "",
      surdetails: "",
    },
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showForm, setShowForm] = useState(true); // controls form visibility

  // Input change handler
  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };


  // Submit form
  const handleSubmit = async () => {
    const userId = await AsyncStorage.getItem("userId"); // <-- actually store it
    try {
      console.log("Submitting:", formData);

      // Patient API
      const patientRes = await axios.post(
        "http://localhost:5001/app/api/patientinfo",
        { ...formData.patient, age: Number(formData.patient.age), userId } // Ensure age is a number
      );

      const patient = patientRes.data.data;
      const patientId = patient._id;
      console.log("Patient ID:", patientId);

      // Doctor API
      await axios.post("http://localhost:5001/app/api/doctorinfo", {
        ...formData.doctor,
        patientId,
      });

      // Hospital API
      await axios.post("http://localhost:5001/app/api/hospitalinfo", {
        ...formData.hospital,
        patientId,
      });

      // Illness API
      await axios.post("http://localhost:5001/app/api/illnessinfo", {
        ...formData.illness,
        patientId,
      });

      setFormData(initialFormData);
      setShowForm(true); 

      Alert.alert("Success", "Record saved successfully ✅");
    } catch (error) {
      console.error("Error saving record:", error);
      Alert.alert("Error", "Failed to save record ❌");
    }
  };

  if (!showForm) {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successText}> Record submitted</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowForm(true)} // reopen form if needed
        >
          <Text style={styles.buttonText}>Add Another Record</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Medical Record Entry</Text>

      {/* Patient Info */}
      <Text style={styles.header}>Patient Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.patient.name}
        onChangeText={(text) => handleChange("patient", "name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={formData.patient.age}
        onChangeText={(text) => handleChange("patient", "age", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Gender"
        value={formData.patient.gender}
        onChangeText={(text) => handleChange("patient", "gender", text)}
      />

      {/* Doctor Info */}
      <Text style={styles.header}>Doctor Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Doctor Name"
        value={formData.doctor.name}
        onChangeText={(text) => handleChange("doctor", "name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Specialization"
        value={formData.doctor.spec}
        onChangeText={(text) => handleChange("doctor", "spec", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Reg No"
        value={formData.doctor.regno}
        onChangeText={(text) => handleChange("doctor", "regno", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Doctor Contact"
        value={formData.doctor.doccontact}
        onChangeText={(text) => handleChange("doctor", "doccontact", text)}
      />

      {/* Hospital Info */}
      <Text style={styles.header}>Hospital Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Hospital Name"
        value={formData.hospital.name}
        onChangeText={(text) => handleChange("hospital", "name", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={formData.hospital.address}
        onChangeText={(text) => handleChange("hospital", "address", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact"
        value={formData.hospital.contact}
        onChangeText={(text) => handleChange("hospital", "contact", text)}
      />

      {/* Illness Info */}
      <Text style={styles.header}>Illness Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Symptoms"
        value={formData.illness.symptoms}
        onChangeText={(text) => handleChange("illness", "symptoms", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Diagnosis"
        value={formData.illness.diagnosis}
        onChangeText={(text) => handleChange("illness", "diagnosis", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Treatment"
        value={formData.illness.treatment}
        onChangeText={(text) => handleChange("illness", "treatment", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prescribed Medicine"
        value={formData.illness.prescribedmed}
        onChangeText={(text) => handleChange("illness", "prescribedmed", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prescribed Time"
        value={formData.illness.prescribedtime}
        onChangeText={(text) => handleChange("illness", "prescribedtime", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Recovery Time"
        value={formData.illness.recoverytime}
        onChangeText={(text) => handleChange("illness", "recoverytime", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Surgery"
        value={formData.illness.surgery}
        onChangeText={(text) => handleChange("illness", "surgery", text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Surgery Details"
        value={formData.illness.surdetails}
        onChangeText={(text) => handleChange("illness", "surdetails", text)}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Record</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 12,
    color: "#2c3e50",
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#34495e",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 30,
    marginBottom: 50,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "green",
  },
});
