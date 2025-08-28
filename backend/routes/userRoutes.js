const express = require('express');
const { Signup, Login,updatePatientRecords,deletePatient,listPatients,getUserProfile,allPatientsForUser, ProtectRoutes, doctor, Setting, home, patient, hospital, illness, getpai } = require('../controller/userController');
const { User, PatientInfo, DoctorInfo, HospitalAdd, Illness } = require('../models/userModels');

const Router = express.Router();

Router.post('/Signup' ,Signup);
Router.post('/Login', Login);
Router.post('/setting', ProtectRoutes, Setting);
Router.post('/home', ProtectRoutes, home);
Router.get('/patients',allPatientsForUser);
Router.post('/patientinfo', patient);
Router.post('/doctorinfo', doctor);
Router.post('/hospitalinfo', hospital);
Router.post('/illnessinfo', illness);
Router.get('/getpatientinfo/:id', getpai);
Router.put("/patient/:patientId/updateRecords", updatePatientRecords);
Router.route("/patient/:id").delete(deletePatient);
Router.get("/user/:userId/profile", getUserProfile);

module.exports = Router;
