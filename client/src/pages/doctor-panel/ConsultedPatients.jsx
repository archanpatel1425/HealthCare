import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserData } from "../../Store/patient/authslice";
import { showToast } from "./Alerts";

const ConsultedPatients = () => {
  const dispatch = useDispatch();
  const { patientData } = useSelector((state) => state.auth);

  const [searchPatient, setSearchPatient] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filterPatients, setFilterPatients] = useState([]);
  const [menuIndex, setMenuIndex] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loader, setLoader] = useState(true)
  const [showFilter, setShowFilter] = useState(false);


  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  useEffect(() => {
    try {
      if (patientData?.doctorId) {
        axios.post(`${import.meta.env.VITE_API_URL}/doctor/done`, { doctorId: patientData?.doctorId }, { withCredentials: true })
          .then((res) => {
            setPatients(res.data);
            setFilterPatients(res.data);
            setLoader(false)
          });
      }
    } catch (error) {
      showToast(error, "error");
      if (error.response.data.message === "Unauthorized: No token provided") {
        window.location.href = "/login"
      }
    }
  }, [patientData]);

  useEffect(() => {
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showPopup]);

  const handleShowMore = (patient) => {
    setSelectedPatient(patient);
    setShowPopup(true);
    setMenuIndex(null);
  };

  const filterBySearch = (name) => {
    setEndDate(null);
    setStartDate(null);
    setFilterPatients(patients.filter(patient =>
      patient.patient.first_name.toLowerCase().includes(name.toLowerCase())
    ));
  };

  const filterByDateRange = (startDate, endDate) => {
    setSearchPatient("");
    const filtered = patients.filter((patient) => {
      const appointmentDate = new Date(patient.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && end) {
        return appointmentDate >= start && appointmentDate <= end;
      } else if (start) {
        return appointmentDate >= start;
      } else if (end) {
        return appointmentDate <= end;
      }
      return true;
    });
    setFilterPatients(filtered);
  };

  const clearFilters = () => {
    setFilterPatients(patients);
    setSearchPatient("");
    setStartDate(null);
    setEndDate(null);
    setShowFilters(false);
  };

  useEffect(() => {
    if (startDate || endDate || searchPatient) {
      setShowFilter(true);
    } else {
      setShowFilter(false);
    }
  }, [startDate, endDate, searchPatient]);

  return (
    <div className="md:px-6 py-2">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-700">Consulted Patients</h1>

        <div className="md:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-green-600 text-white px-4 py-2 rounded"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className={`flex flex-col md:flex-row gap-4 ${showFilters || 'hidden md:flex'}`}>
          <div className={`grid grid-cols-1 ${showFilter ? "md:grid-cols-4" : "md:grid-cols-3"} gap-4`}>

            <div className="flex flex-col">
              <span className="text-sm">Start Date</span>
              <input
                type="date"
                className="px-2 border-2 border-gray-400 rounded-lg focus:border-gray-800 py-1"
                value={startDate || ""}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  filterByDateRange(e.target.value, endDate);
                }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm">End Date</span>
              <input
                type="date"
                className="px-2 border-2 border-gray-400 rounded-lg focus:border-gray-800 py-1"
                value={endDate || ""}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  filterByDateRange(startDate, e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col">
              <span className="text-sm">Patient Name</span>
              <input
                className="px-2 border-2 border-gray-400 rounded-lg focus:border-gray-800 py-1"
                type="text"
                value={searchPatient}
                placeholder="Search"
                onChange={(e) => {
                  setSearchPatient(e.target.value);
                  filterBySearch(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col">
              {showFilter &&
                <button
                  className="bg-red-600 text-white px-4 rounded py-2 h-fit mt-auto"
                  onClick={clearFilters}
                >
                  <i className="fa-solid fa-filter-circle-xmark me-2"></i><span>Clear Filter</span>
                </button>
              }
            </div>

          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="max-h-[72.5vh] overflow-y-auto">
            <table className="min-w-full border-collapse">
              <thead className="sticky top-0 bg-green-600 text-white uppercase z-10">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Name</th>
                  <th className="px-4 py-3 text-left text-sm">Gender</th>
                  <th className="px-4 py-3 text-left text-sm">Reason</th>
                  <th className="px-4 py-3 text-left text-sm">Date</th>
                  <th className="px-4 py-3 text-left text-sm">Time</th>
                  <th className="px-4 py-3 text-center text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loader && <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>}
                {filterPatients.length === 0 && !loader && (!startDate && !endDate && !searchPatient) && <tr><td colSpan="6" className="text-center py-4">No Consulted Patients(s) Found</td></tr>}
                {filterPatients.length === 0 && !loader && (startDate || endDate || searchPatient) && <tr><td colSpan="6" className="text-center py-4">No Such Record(s) Found</td></tr>}
                {filterPatients.map((patient, index) => (
                  <tr key={index} className="hover:bg-green-50">
                    <td className="px-4 py-3 border-b text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {patient.patient.first_name} {patient.patient.last_name}
                    </td>
                    <td className="px-4 py-3 border-b text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {patient.patient.gender}
                    </td>
                    <td className="px-4 py-3 border-b text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {patient.reason}
                    </td>
                    <td className="px-4 py-3 border-b text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {new Date(patient.date).toLocaleDateString('en-GB').replace(/\//g, '-')}
                    </td>
                    <td className="px-4 py-3 border-b text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                      {patient.time}
                    </td>
                    <td className="px-4 py-3 border-b text-center relative">
                      <button
                        onClick={() => handleShowMore(patient)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {filterPatients.length == 0 && (
                  <tr></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Details Popup */}
      {showPopup && selectedPatient && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between sticky top-0 bg-white p-4 border-b">
              <h2 className="text-lg md:text-xl font-bold text-gray-700">Patient Details</h2>
              <button className="text-2xl" onClick={() => setShowPopup(false)}>×</button>
            </div>
            <div className="flex flex-col md:flex-row p-4 md:p-6">
              <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                <img
                  className="w-full h-auto max-h-72 md:max-h-96 object-cover rounded-lg"
                  src={selectedPatient.patient.profilepic}
                  alt="Patient"
                />
              </div>
              <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-between">
                <div className="space-y-2">
                  <p><strong>Name:</strong> {selectedPatient.patient.first_name} {selectedPatient.patient.last_name}</p>
                  <p><strong>Gender:</strong> {selectedPatient.patient.gender}</p>
                  <p><strong>Phone:</strong> {selectedPatient.patient.phone_no}</p>
                  <p><strong>Email:</strong> {selectedPatient.patient.email}</p>
                  <p><strong>Date:</strong> {new Date(selectedPatient.date).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
                  <p><strong>Time:</strong> {selectedPatient.time}</p>
                  <p><strong>Reason:</strong> {selectedPatient.reason}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultedPatients;