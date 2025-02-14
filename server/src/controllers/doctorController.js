import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


const getId = async (req, res) => {
  try {
    const doctorId = req.userId;
    const { appointmentId } = req.body;
    // Find the appointment and get the patient_Id
    const appointment = await prisma.appointment.findUnique({
      where: { appointmentId:appointmentId },
      select: { patient_Id: true }
    });
    // If no appointment is found
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json({ patientId: appointment.patient_Id });

  } catch (error) {
    console.error('Error fetching patientId:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default getId;

const getDoctorProfile = async (req, res) => {
  try {

    const doctorId = req.body.doctorId; // Extract doctor ID from token

    const doctor = await prisma.doctor.findUnique({
      where: { doctorId: doctorId },
      select: {
        doctorId: true,
        first_name: true,
        last_name: true,
        gender: true,
        phone_no: true,
        profilepic: true,
        email: true,
        specialization: true,
        experience: true,
        qualifications: true,
        availability: true,
      },
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const {
      first_name,
      last_name,
      gender,
      phone_no,
      profilepic,
      email,
      specialization,
      experience,
      qualifications,
      availability,
    } = req.body.formData;

    const updatedDoctor = await prisma.doctor.update({
      where: { doctorId },
      data: {
        first_name,
        last_name,
        gender,
        phone_no,
        profilepic,
        email,
        specialization,
        experience,
        qualifications,
        availability: availability,
      },
    });

    res.json({
      message: "Profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body; 
    const updatedDoctor = await prisma.appointment.update({
      where: { appointmentId },
      data: { status },
    });

    res.json({
      message: "Doctor status updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

const uploadProfilePhoto = async (req, res) => {
  try {
    const { doctorId, photoUrl } = req.body; // Get status from request body

    const updatedDoctor = await prisma.doctor.update({
      where: { doctorId },
      data: { profilepic: photoUrl },
    });

    res.json({
      message: "success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

const uploadQualificationPhoto = async (req, res) => {
  try {
    const { doctorId, photoUrl } = req.body; // Get status from request body

    const updatedDoctor = await prisma.doctor.update({
      where: { doctorId },
      data: { qualifications: photoUrl },
    });

    res.json({
      message: "success",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

const submitPrescription = async (req, res) => {
  try {
    const { data, notes, appointmentId, patientId, doctorId } = req.body;
    if (!appointmentId || !patientId || !doctorId || !data) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert medicine array into JSON string
    const medicines = JSON.stringify(data);

    // Insert prescription into the database
    const newPrescription = await prisma.prescription.create({
      data: {
        appointment_Id: appointmentId,
        patient_Id: patientId,
        doctor_Id: doctorId,
        medicines: medicines,
        notes: notes
      }
    });
    res.status(201).json({
      message: "Prescription created successfully",
      prescription: newPrescription
    });

  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating status", error: error.message });
  }
};

const getPendingAppointments = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const pendingAppointments = await prisma.appointment.findMany({
      where: {
        doctor_Id: doctorId,
        status: "Pending",
      },
      include: { patient: true },
      orderBy: {
        date: "desc",
      },
    });
    res.json(pendingAppointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pending appointments",
      error: error.message,
    });
  }
};


const getAcceptedAppointments = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const acceptedAppointments = await prisma.appointment.findMany({
      where: {
        doctor_Id: doctorId,
        status: "Scheduled",
      },
      include: { patient: true },
      orderBy: {
        date: "desc",
      },
    });
    res.json(acceptedAppointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching accepted appointments",
      error: error.message,
    });
  }
};

const getDoneAppointments = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;
    const doneAppointments = await prisma.appointment.findMany({
      where: {
        doctor_Id: doctorId,
        status: "Completed",
      },
      orderBy: {
        date: "desc",
      },
      include: { patient: true },
    });
    res.json(doneAppointments);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching done appointments",
      error: error.message,
    });
  }
};

export { getAcceptedAppointments, getDoctorProfile, getDoneAppointments, getPendingAppointments, submitPrescription, updateAppointmentStatus, updateDoctorProfile, uploadProfilePhoto, uploadQualificationPhoto,getId};

