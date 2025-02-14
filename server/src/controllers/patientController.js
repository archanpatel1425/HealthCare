import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Initialize once
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getMedicineLinks = async (medicines) => {
  if (!medicines || medicines.length === 0) return [];

  try {
    const prompt = `Provide a single reliable online link for information about each of the following medicines: ${medicines.join(", ")}. The link should lead to a trusted medical or pharmaceutical website.`;

    const result = await model.generateContent(prompt);
    const text = await result.response.text(); // Fetch response text

    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const links = text.match(linkRegex) || [];
    return medicines.map((med, index) => ({
      medicine: med,
      link: links[index] || "No link found.",
    }));
  } catch (error) {
    console.error("Error fetching medicine links:", error.message);
    return medicines.map(med => ({ medicine: med, link: "Error fetching link." }));
  }
};

export const getDoctorList = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany()
    res.status(200).json(doctors)
  } catch (error) {
    console.error("error : ", error)
  }
}

export const getDoctorInfo = async (req, res) => {
  try {
    const doctorId = req.params.doctorId
    const doctor = await prisma.doctor.findUnique({
      where: {
        doctorId: doctorId
      }
    })
    res.status(200).json(doctor)
  } catch (error) {
    console.error("error is : ", error)
  }
}

export const getAppointmentsByPatient = async (req, res) => {
  try {
    const  patientId  = req.userId
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
    const patientId = req.userId;

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

    const doctors = await prisma.doctor.findMany({
      select: {
        email: true,
        phone_no: true,
        gender: true,
        doctorId: true,
        first_name: true,
        last_name: true,
        specialization: true,
        profilepic: true,
        experience: true,
        qualifications: true,
        specialization: true,
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
    const appointment_data = req.body;
    if (!appointment_data.patient_Id || !appointment_data.doctor_Id || !appointment_data.date || !appointment_data.time) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const appointment = await prisma.appointment.create({
      data: appointment_data
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

export const getDoctorSchedule = async (req, res) => {
  const doctorId = req.body.doctorId;
  const { availability } = await prisma.doctor.findUnique({
    where: { doctorId },
    select: { availability: true },
  });

  const schedule = await prisma.appointment.findMany({
    where: { doctor_Id: doctorId },
    select: {
      date: true,
      time: true,
    },
  });

  const slotDetails = generateDateWiseSlots(availability, schedule, 30);
  res.json(slotDetails);
}

const generateDateWiseSlots = (availability, schedule, days = 30) => {
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const adjustedMinutes = (minutes + 1440) % 1440; // Wrap around 24 hours
    const hours = Math.floor(adjustedMinutes / 60);
    const mins = adjustedMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  };

  const today = new Date();
  const dates = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return date.toISOString().split('T')[0];
  });

  const slotsByDate = {};

  dates.forEach((date) => {
    const { from, to } = availability.time;
    let startMinutes = timeToMinutes(from);
    let endMinutes = timeToMinutes(to);

    const dayOfWeek = new Date(date).getDay();
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];

    if (!availability.days.includes(dayName)) {
      return;
    }

    const bookedTimes = schedule
      .filter(appt => new Date(appt.date).toISOString().split('T')[0] === date)
      .map(appt => timeToMinutes(appt.time));

    const slots = [];

    // Handle overnight slots
    if (endMinutes <= startMinutes) {
      endMinutes += 1440; // Extend past midnight
    }

    for (let time = startMinutes; time < endMinutes; time += 30) {
      const slotFrom = minutesToTime(time);
      const slotTo = minutesToTime(time + 30);
      const isBooked = bookedTimes.includes(time % 1440); // Ensure modulo for wrapping

      slots.push({ from: slotFrom, to: slotTo, available: !isBooked });
    }

    slotsByDate[date] = slots;
  });

  return slotsByDate;
};
