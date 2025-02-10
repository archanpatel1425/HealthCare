import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getDoctorList = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany()
    res.status(200).json(doctors)
  } catch (error) {
    console.log("error : ", error)
  }
}

export const getDoctorInfo=async(req,res)=>{
  try {
    const doctorId=req.params.doctorId
    const doctor=await prisma.doctor.findUnique({
      where:{
        doctorId:doctorId
      }
    })
    res.status(200).json(doctor)
  } catch (error) {
    console.log("error is : ",error)
  }
}

export const getAppointmentsByPatient = async (req, res) => {
  try {
    const { patientId } = req.body

    const appointments = await prisma.appointment.findMany({
      where: { patient_Id: patientId },
      include: {
        doctor: {
          select: {
            first_name: true,
            last_name: true,
            specialization: true,
          },
        },
        patient: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
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
    const patientId = req.userId; // Assuming patientId is passed in the request body
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
    } = req.body;
    console.log(req.body)
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
    const patientId  = req.userId;

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


export const getDoctorsBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;

    // Fetch doctors based on specialization
    const doctors = await prisma.doctor.findMany({
      where: {
        specialization: specialization
      },
      select: {
        doctorId: true,
        first_name: true,
        last_name: true,
        profilepic: true,
        experience: true,
        qualifications: true,
        availability: true
      }
    });

    // If no doctors are found
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found for this specialization." });
    }

    return res.status(200).json({ doctors });

  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const { patient_Id, doctor_Id, date, time, reason, status } = req.body;


    if (!patient_Id || !doctor_Id || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const appointment = await prisma.appointment.create({
      data: {
        patient_Id,
        doctor_Id,
        date: new Date(date),
        time,
        reason: reason || null,
        status: status || "pending",
      },
    });

    res.status(201).json({
      message: "Appointment created successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      message: "Failed to create appointment",
      error: error.message,
    });
  }
};