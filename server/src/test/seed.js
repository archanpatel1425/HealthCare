import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
dotenv.config();


const prisma = new PrismaClient();

const doctorId = 'aa8caa4b-9cca-4b26-adfd-212de59cdbed';
const patientId = 'b98d9e72-33bb-4c2c-99b7-2ff4be72710a';

async function main() {
    // Insert 5 prescription entries
    await prisma.prescription.createMany({
        data: [
            {
                appointment_Id: 'a1b2c3d4-e567-89f0-1234-56789abcdef1',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Paracetamol 500mg, Amoxicillin 250mg',
                notes: 'Take medicines after food',
            },
            {
                appointment_Id: 'b5a4ca58-ef92-41fb-8a04-46da37d2e219',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Ibuprofen 400mg, Vitamin D3',
                notes: 'Drink plenty of water',
            },
            {
                appointment_Id: 'ee7827b8-8ca8-4875-8768-6cb7be51e2c9',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Cough Syrup, Levocetirizine 5mg',
                notes: 'Avoid cold drinks',
            },
            {
                appointment_Id: 'a5b6c7d8-e901-23f4-5678-90123abcdef5',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Omeprazole 20mg, Antacid Gel',
                notes: 'Take before meals',
            },
            {
                appointment_Id: 'f6870bdd-0151-4d52-8556-cee9a54ce6f6',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Painkiller, Muscle Relaxant',
                notes: 'Take only if pain persists',
            },
        ],
    });

    console.log('Inserted 5 prescriptions.');

    // Fetch and log all prescription entries
    const prescriptions = await prisma.prescription.findMany({
        include: {
            doctor: true,
            patient: true,
            appointment: true,
        },
    });

    console.log('Prescriptions:', prescriptions);
}

// Execute the function
main()
    .catch((error) => {
        console.error('Error:', error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
