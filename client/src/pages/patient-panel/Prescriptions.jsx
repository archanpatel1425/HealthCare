import { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useSelector } from "react-redux";
import { FaInfoCircle } from "react-icons/fa";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY); // Initialize once
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const MedicineCard = ({ medicine, link }) => {
    return (
        <div className="p-4 bg-green-100 shadow-md rounded-lg border border-green-300">
            <div className="flex justify-between items-center">
                <h4 className="font-semibold text-green-800">
                    {medicine.drugName}
                </h4>
                <a
                    href={link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-green-600 hover:text-green-800 ${link === "No link found." ? "cursor-not-allowed opacity-50" : ""}`}
                    title="More Info"
                >
                    <FaInfoCircle size={18} />
                </a>
            </div>
            <p className="text-green-600">Meal Timing: {medicine.mealTiming}</p>
            <div className="flex justify-between w-full mt-2">
                {console.log(medicine.breakfast)
                }
                <span className={`text-sm ${medicine.breakfast ? 'text-red-600' : 'text-green-600'}`}>Breakfast: {medicine.breakfast ? 'Yes' : 'No'}</span>
                <span className={`text-sm ${medicine.lunch ? 'text-red-600' : 'text-green-600'}`}>Lunch: {medicine.lunch ? 'Yes' : 'No'}</span>
                <span className={`text-sm ${medicine.dinner ? 'text-red-600' : 'text-green-600'}`}>Dinner: {medicine.dinner ? 'Yes' : 'No'}</span>
            </div>
        </div>
    );
};

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [medicineLinks, setMedicineLinks] = useState({});
    const { patientData } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/patient/getpriscription`,{withCredentials:true});
                const data = response.data.map(prescription => ({
                    ...prescription,
                    medicines: JSON.parse(prescription.medicines || "[]")
                }));

                setPrescriptions(data);
                if (data.length > 0) {
                    setSelectedPrescription(data[0]);
                }

                const uniqueMedicines = [...new Set(data.flatMap(p => p.medicines.map(m => m.drugName)))];
                fetchMedicineLinks(uniqueMedicines);

            } catch (error) {
                console.error("Error fetching prescriptions:", error);
            }
        };

        fetchPrescriptions();
    }, [patientData]);

    const fetchMedicineLinks = async (medicineNames) => {
        try {
            if (!medicineNames.length) return;
    
    
            const prompt = `Provide a single reliable online link for information about each of the following medicines: ${medicineNames.join(", ")}. The link should lead to a trusted medical or pharmaceutical website.`;
    
            const result = await model.generateContent(prompt);
            const text = await result.response.text(); // Extract response text
    
            const linkRegex = /(https?:\/\/[^\s]+)/g;
            const links = text.match(linkRegex) || [];
    
            const linksMap = medicineNames.reduce((acc, med, index) => {
                acc[med] = links[index] || "No link found.";
                return acc;
            }, {});
            console.log(linksMap);
            setMedicineLinks(linksMap);
        } catch (error) {
            console.error("Error fetching medicine links:", error);
        }
    };
    

    const selectPrescription = (prescription) => {
        setSelectedPrescription(selectedPrescription?.prescriptionId === prescription.prescriptionId ? null : prescription);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-green-100 shadow-lg rounded-lg flex space-x-6">
            <div className="w-1/3 space-y-3">
                {prescriptions.map((prescription) => (
                    <div key={prescription.prescriptionId} className="bg-white border border-green-300 rounded-lg shadow-sm cursor-pointer hover:bg-green-200 transition"
                        onClick={() => selectPrescription(prescription)}>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-green-800">Doctor: {prescription.doctor.first_name} {prescription.doctor.last_name}</h3>
                            <p className="text-sm text-green-600">{new Date(prescription.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPrescription && (
                <div className="w-2/3 bg-white border border-green-300 rounded-lg shadow-md p-6">
                    <div className="flex w-full justify-between">
                        <h3 className="text-xl font-semibold text-green-800 border border-green-300 p-2 bg-green-100 rounded-md">Doctor: {selectedPrescription.doctor.first_name} {selectedPrescription.doctor.last_name}</h3>
                        <p className="text-sm text-green-600 border border-green-300 p-1 h-8 rounded-md"  >{new Date(selectedPrescription.createdAt).toLocaleDateString()}</p></div>
                    <p className="text-green-800 mt-2 text-red-600">Notes: {selectedPrescription.notes || "No notes available"}</p>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedPrescription.medicines.length > 0 ? (
                            selectedPrescription.medicines.map((medicine, index) => (
                                <MedicineCard key={index} medicine={medicine} link={medicineLinks[medicine.drugName]} />
                            ))
                        ) : (
                            <p className="text-green-500">No medicines prescribed.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Prescriptions;