import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const doctorId = '06fc0466-d6a5-450f-a97b-657318555483';
const patientId = '3f906b10-fc1d-4de7-b11b-ac31d8a9de70';

async function main() {
    // Insert 5 prescription entries
    await prisma.prescription.createMany({
        data: [
            {
                appointment_Id: '5a3d6a43-a315-4c06-a17d-f23adf133071',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Paracetamol 500mg, Amoxicillin 250mg',
                notes: 'Take medicines after food',
            },
            {
                appointment_Id: '5a3d6a43-a315-4c06-a17d-f23adf133071',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Ibuprofen 400mg, Vitamin D3',
                notes: 'Drink plenty of water',
            },
            {
                appointment_Id: '5a3d6a43-a315-4c06-a17d-f23adf133071',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Cough Syrup, Levocetirizine 5mg',
                notes: 'Avoid cold drinks',
            },
            {
                appointment_Id: '5a3d6a43-a315-4c06-a17d-f23adf133071',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Omeprazole 20mg, Antacid Gel',
                notes: 'Take before meals',
            },
            {
                appointment_Id: '5a3d6a43-a315-4c06-a17d-f23adf133071',
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
