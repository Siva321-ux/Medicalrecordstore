const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);


const patientSchema = mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  hospitals:[ { type: mongoose.Schema.Types.ObjectId, ref: "Hospital" }],
  illnesses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Illness" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const PatientInfo = mongoose.model("Patient", patientSchema);

const doctorSchema = mongoose.Schema({
  name: { type: String, required: true },
  spec: { type: String, required: true },
  regno: { type: String },
  doccontact: { type: String },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }
}, { timestamps: true });

const DoctorInfo = mongoose.model("Doctor", doctorSchema);


const hospitalSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }
}, { timestamps: true });

const HospitalAdd = mongoose.model("Hospital", hospitalSchema);


const illnessSchema = mongoose.Schema({
  symptoms: { type: String, required: true },
  diagnosis: { type: String, required: true },
  treatment:{ type: String, required: true },
  prescribedmed: { type: String, required: true },
  prescribedtime: { type: String, required: true },
  recoverytime: { type: String }, 
  surgery: { type: String },
  surdetails: { type: String },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" }
}, { timestamps: true });

const Illness = mongoose.model("Illness", illnessSchema);

module.exports = { User, PatientInfo, DoctorInfo, HospitalAdd, Illness };
