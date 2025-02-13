import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaFileMedical, FaFilter, FaInfoCircle, FaUserMd } from "react-icons/fa";
import { useSelector } from "react-redux";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const MedicineCard = ({ medicine, link }) => (
    <div className="p-4 bg-white shadow-md rounded-lg border border-black">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold -800">{medicine.drugName}</h4>
            <div className="flex items-center space-x-2">
                <a
                    href={link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={` ${link === "No link found." ? "cursor-not-allowed opacity-50" : ""}`}
                >
                    Buy
                </a>
                <a
                    href={link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={` ${link === "No link found." ? "cursor-not-allowed opacity-50" : ""}`}
                    title="More Info"
                >
                    <FaInfoCircle size={18} />
                </a>
            </div>
        </div>
        <p className="">Meal Timing: {medicine.mealTiming}</p>
        <div className="flex justify-between w-full mt-2">
            <span className={`text-sm ${medicine.breakfast ? 'text-blue-600' : 'text-black'}`}>Breakfast: {medicine.breakfast ? 'Yes' : 'No'}</span>
            <span className={`text-sm ${medicine.lunch ? 'text-blue-600' : 'text-black'}`}>Lunch: {medicine.lunch ? 'Yes' : 'No'}</span>
            <span className={`text-sm ${medicine.dinner ? 'text-blue-600' : 'text-black'}`}>Dinner: {medicine.dinner ? 'Yes' : 'No'}</span>
        </div>
    </div>
);

const Prescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [medicineLinks, setMedicineLinks] = useState({});
    const [filterDate, setFilterDate] = useState("");
    const [filterDoctor, setFilterDoctor] = useState("");
    const { patientData } = useSelector((state) => state.auth);
    const [isfiltered, setfilter] = useState(false)

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/patient/getpriscription`, { withCredentials: true });
                console.log(response.data)
                const data = response.data.map(p => ({ ...p, medicines: JSON.parse(p.medicines || "[]") }));
                console.log(data)
                setPrescriptions(data);
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
            const prompt = `give any single http link where i can buy these specific medicines: ${medicineNames.join(", ")}.`;
            const result = await model.generateContent(prompt);
            const text = await result.response.text();
            console.log(text);

            const linkRegex = /(https?:\/\/[^\s]+)/g;
            const links = text.match(linkRegex) || [];
            const linksMap = medicineNames.reduce((acc, med, index) => {
                acc[med] = links[index] || "No link found.";
                return acc;
            }, {});
            setMedicineLinks(linksMap);
        } catch (error) {
            console.error("Error fetching medicine links:", error);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        (!filterDate || new Date(p.createdAt).toISOString().split("T")[0] === filterDate) &&
        (!filterDoctor || `${p.doctor.first_name} ${p.doctor.last_name}`.toLowerCase().includes(filterDoctor.toLowerCase()))
    );

    return (
        <div className="w-full h-full p-6 bg-white shadow-lg rounded-lg overflow-hidden" data-aos="zoom-in-up">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-medium flex items-center w-full sm:w-auto">
                    <FaFileMedical className="mr-2" /> Prescriptions
                </h2>
                <div className="flex flex-col sm:flex-row sm:gap-4 w-full sm:w-auto items-end">
                    <div className="flex flex-col w-full sm:w-auto">
                        <label className="font-medium">Filter by Date:</label>
                        <input
                            type="date"
                            className="p-2 border border-gray-300 rounded-md w-full"
                            value={filterDate}
                            onChange={(e) => {
                                setFilterDate(e.target.value)
                                e.target.value ? setfilter(true) : setfilter(false)
                            }}
                        />
                    </div>
                    <div className="flex flex-col w-full sm:w-auto">
                        <label className="font-medium">Filter by Doctor:</label>
                        <input
                            type="text"
                            className="p-2 border border-gray-300 rounded-md w-full"
                            placeholder="Enter doctor's name"
                            value={filterDoctor}
                            onChange={(e) => {
                                setFilterDoctor(e.target.value)
                                e.target.value ? setfilter(true) : setfilter(false)
                            }}
                        />
                    </div>
                    <button
                        className={`px-4 py-2 bg-red-500 text-white rounded-md w-full sm:w-auto h-10 mt-6 sm:mt-0 ${isfiltered ? '' : 'hidden'}`}
                        onClick={() => { setFilterDate(""); setFilterDoctor(""); setfilter(false) }}
                    >
                        <i className="fa-solid fa-filter-circle-xmark me-2"></i><span>Clear Filter</span>
                    </button>
                </div>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-400px)] sm:max-h-[calc(100vh-270px)] md:max-h-[calc(100vh-260px)] lg:max-h-[calc(100vh-240px)]">
                {filteredPrescriptions.length > 0 ? (
                    filteredPrescriptions.map((prescription) => (
                        <div key={prescription.prescriptionId} className="w-full bg-blue-50 border border-black rounded-lg shadow-md p-6 mb-6 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                <h3 className="text-lg font-semibold flex items-center"><FaUserMd className="mr-2" /> {prescription.doctor.first_name} {prescription.doctor.last_name}</h3>
                                <p className="text-sm flex items-center"><FaCalendarAlt className="mr-2" /> {new Date(prescription.createdAt).toLocaleDateString()}</p>
                            </div>
                            <p className="text-red-600">Notes: {prescription.notes || "No notes available"}</p>
                            <div className="mt-4 grid grid-cols-1 gap-4">
                                {prescription.medicines.length > 0 ? (
                                    prescription.medicines.map((medicine, index) => (
                                        <MedicineCard key={index} medicine={medicine} link={medicineLinks[medicine.drugName]} />
                                    ))
                                ) : (
                                    <p className="text-red-500 font-medium">No medicines prescribed.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-48">
                        <FaFileMedical className="text-gray-400 text-5xl mb-4" />
                        <p className="text-gray-600 text-lg font-medium">No prescriptions found</p>
                        {isfiltered && (
                            <p className="text-gray-500 mt-2">Try adjusting your filters or clear them to see all prescriptions</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Prescriptions;