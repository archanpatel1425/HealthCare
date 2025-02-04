import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params; // Get patientId from URL params

    const appointments = await prisma.appointment.findMany({
      where: { patient_Id: patientId },
      include: {
        doctor: true, // Include doctor details
        prescription: true, // Include prescriptions if available
        billing: true, // Include billing info if available
      },
      orderBy: {
        date: "desc", // Sort by latest appointment
      },
    });

    if (!appointments.length) {
      return res.status(404).json({ message: "No appointments found for this patient" });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Failed to fetch appointments", error: error.message });
  }
};


//update profile

export const updatePatientProfile = async (req, res) => {
    try {
      const patientId = req.body.patientId; // Assuming patientId is passed in the request body
      const {
        first_name,
        last_name,
        gender,
        phone_no,
        profilepic,
        email,
        password,
        accountStatus,
        googleId,
        resetToken,
        refreshToken,
      } = req.body.formData;
  
      // Update the patient profile in the database
      const updatedPatient = await prisma.patient.update({
        where: { patientId }, // Use patientId to find the patient
        data: {
          first_name,
          last_name,
          gender,
          phone_no,
          profilepic,
          email,
          password,
          accountStatus,
          googleId,
          resetToken,
          refreshToken,
        },
      });
  
      // Send a success response
      res.json({
        message: "Patient profile updated successfully",
        patient: updatedPatient,
      });
    } catch (error) {
      // Handle errors
      res.status(500).json({
        message: "Error updating patient profile",
        error: error.message,
      });
    }
  };



export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await prisma.prescription.findMany({
      where: { patient_Id: patientId },
      include: {
        doctor: true,
        appointment: true,
      },
    });

    if (!prescriptions.length) {
      return res.status(404).json({ message: "No prescriptions found for this patient" });
    }

    res.status(200).json(prescriptions);
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ message: "Failed to fetch prescriptions", error: error.message });
  }
};





export const getReportsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const reports = await prisma.medicalReport.findMany({
      where: { patient_Id: patientId },
      orderBy: { createdAt: "desc" }, // Latest reports first
    });

    if (!reports.length) {
      return res.status(404).json({ message: "No medical reports found for this patient" });
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Failed to fetch reports", error: error.message });
  }
};



