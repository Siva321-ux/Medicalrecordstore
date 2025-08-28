const { User, PatientInfo, DoctorInfo, HospitalAdd, Illness } = require('../models/userModels');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const saltRounds = 10;
let refreshTokens = [];


const allPatientsForUser = async (req, res) => {
  try {
    const userId = req.query.userId;

    const patients = await PatientInfo.find({
      createdBy: new mongoose.Types.ObjectId(userId)
    })
      .populate("doctors")
      .populate("hospitals")
      .populate("illnesses");

    res.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};
const Signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET,{expiresIn: "10m"} );

    refreshTokens.push(refreshToken);
    

    return res.status(200).json({
      userId: user._id,
      success: true,
      message: "Login successful",
      email: user.email,
      accessToken,
      refreshToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

function generateAccessToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}


const ProtectRoutes = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};


const patient = async (req, res) => {
  const { name, age, gender,userId} = req.body;
 
  try {
    const pat = await PatientInfo.create({ name, age, gender,createdBy: userId  });
    res.status(200).json({ success: true, data: pat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating patient" });
  }
};



const doctor = async (req, res) => {
  const { name, spec, regno, doccontact, patientId } = req.body;
  try {
    const doc = await DoctorInfo.create({ name, spec, regno, doccontact, patientId });
    if (patientId) {
      await PatientInfo.findByIdAndUpdate(patientId, { $push: { doctors: doc._id } });
    }
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating doctor" });
  }
};


const hospital = async (req, res) => {
  const { name, address, contact, patientId } = req.body;
  try {
    const hosp = await HospitalAdd.create({ name, address, contact, patientId });
    if (patientId) {
      await PatientInfo.findByIdAndUpdate(patientId, { $push: { hospitals: hosp._id } });
    }
    res.status(200).json({ success: true, data: hosp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating hospital" });
  }
};


const illness = async (req, res) => {
  const { symptoms, diagnosis, treatment,prescribedtime, prescribedmed, recoverytime, surgery, surdetails, patientId } = req.body;
  try {
    const ill = await Illness.create({ symptoms, diagnosis,treatment, prescribedtime, prescribedmed, recoverytime, surgery, surdetails, patientId });
    if (patientId) {
      await PatientInfo.findByIdAndUpdate(patientId, { $push: { illnesses: ill._id } });
    }
    res.status(200).json({ success: true, data: ill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating illness" });
  }
};


const getpai = async (req, res) => {
  try {
    const pat = await PatientInfo.findById(req.params.id)
      .populate("doctors")
      .populate("hospitals")
      .populate("illnesses");

    if (!pat) return res.status(404).json({ success: false, message: "Patient not found" });

    res.status(200).json({ success: true, data: pat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching patient" });
  }
};

   
const updatePatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { doctor, hospital, illness, name, age, gender } = req.body;

    const patient = await PatientInfo.findById(patientId);
    
    if (!patient) return res.status(404).json({ message: "Patient not found" });


    if (name) patient.name = name;
    if (age) patient.age = age;
    if (gender) patient.gender = gender;

    
    if (doctor) {
      if (doctor._id) {
        await DoctorInfo.findByIdAndUpdate(doctor._id, doctor, { new: true });
      } else {
        const newDoctor = new DoctorInfo({ ...doctor, patientId });
        await newDoctor.save();
        patient.doctors.push(newDoctor._id);
      }
    }

   
    if (hospital) {
      if (hospital._id) {
        await HospitalAdd.findByIdAndUpdate(hospital._id, hospital, { new: true });
      } else {
        const newHospital = new HospitalAdd({ ...hospital, patientId });
        await newHospital.save();
        patient.hospitals.push(newHospital._id);
      }
    }


    if (illness) {
      if (illness._id) {
        await Illness.findByIdAndUpdate(illness._id, illness, { new: true });
      } else {
        const newIllness = new Illness({ ...illness, patientId });
        await newIllness.save();
        patient.illnesses.push(newIllness._id);
      }
    }

    await patient.save();

    const updated = await PatientInfo.findById(patientId)
      .populate("doctors")
      .populate("hospitals")
      .populate("illnesses");

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating patient records:", err);
    res.status(500).json({ error: err.message });
  }
};



const listPatients = async (req, res) => {
  try {
    const userId = req.user.id;
    const patients = await PatientInfo.find({ createdBy: userId })
      .populate("doctors")
      .populate("hospitals")
      .populate("illnesses")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: patients });
  } catch (err) {
    console.error("Error listing patients:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select("name email createdAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    const patientsCount = await PatientInfo.countDocuments({ createdBy: userId });
    const doctorsCount = await DoctorInfo.countDocuments({ patientId: { $exists: true } });
    const hospitalsCount = await HospitalAdd.countDocuments({ patientId: { $exists: true } });
    const illnessesCount = await Illness.countDocuments({ patientId: { $exists: true } });

    res.json({
      user,
      stats: {
        patients: patientsCount,
        doctors: doctorsCount,
        hospitals: hospitalsCount,
        illnesses: illnessesCount,
      },
    });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const deletePatient = async (req, res) => {
  try {
    const patientId = req.params.id;

   
    await Illness.deleteMany({ patientId });
    await DoctorInfo.deleteMany({ patientId });

    await HospitalAdd.deleteMany({ patientId });

    const deletedPatient = await PatientInfo.findByIdAndDelete(patientId);

    if (!deletedPatient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    res.json({ success: true, message: "Patient and related records deleted successfully" });

  } catch (error) {
    console.error("Error deleting patient:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};



const Setting = (req, res) => res.status(200).json({ success: true });
const home = (req, res) => res.status(200).json({ success: true });

module.exports = { Signup, Login, ProtectRoutes, Setting, home, patient,listPatients, doctor, hospital,getUserProfile,allPatientsForUser, illness, getpai,updatePatientRecords,deletePatient};
