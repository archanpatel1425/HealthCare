import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.body.doctorId; // Extract doctor ID from token
    console.log(doctorId);
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
    console.log(doctor);
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
      availability:JSON.parse(availability),
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
    const { appointmentId, status } = req.body; // Get status from request body

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


const getPendingAppointments = async (req, res) => {
  try {
    const doctorId = req.body.doctorId;

    const pendingAppointments = await prisma.appointment.findMany({
      where: {
        doctor_Id: doctorId,
        status: "Scheduled",
      },
      include: { patient: true },
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
        status: "Accepted",
      },
      include: { patient: true },
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

export { getDoctorProfile, getPendingAppointments, updateDoctorProfile, getAcceptedAppointments, getDoneAppointments, updateAppointmentStatus };
