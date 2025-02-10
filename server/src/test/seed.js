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
                appointment_Id: '952b41e9-eaf8-4e47-8e6c-3a99c499bba7',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Paracetamol 500mg, Amoxicillin 250mg',
                notes: 'Take medicines after food',
            },
            {
                appointment_Id: '952b41e9-eaf8-4e47-8e6c-3a99c499bba7',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Ibuprofen 400mg, Vitamin D3',
                notes: 'Drink plenty of water',
            },
            {
                appointment_Id: '952b41e9-eaf8-4e47-8e6c-3a99c499bba7',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Cough Syrup, Levocetirizine 5mg',
                notes: 'Avoid cold drinks',
            },
            {
                appointment_Id: 'ecdf548b-ae0a-435a-ac8f-2a3c3c0f4f00',
                doctor_Id: doctorId,
                patient_Id: patientId,
                medicines: 'Omeprazole 20mg, Antacid Gel',
                notes: 'Take before meals',
            },
            {
                appointment_Id: 'ecdf548b-ae0a-435a-ac8f-2a3c3c0f4f00',
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
