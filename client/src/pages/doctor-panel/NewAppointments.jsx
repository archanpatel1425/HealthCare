import React, { useState, useEffect } from "react";
import axios from 'axios'
import { showToast } from "./Alerts"; './Alerts'
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData } from '../../Store/patient/authslice';

const NewAppointments = () => {

  const dispatch = useDispatch();

  const { patientData } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserData())
  }, []);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // fixed
  const [patients, setPatients] = useState([])
  // not fixed
  const [filterPatients, setFilterPatients] = useState([])


  const handleRowClick = (patient) => {
    setSelectedPatient(patient);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedPatient(null);
  };

  useEffect(() => {
    axios.post(`${import.meta.env.VITE_API_URL}/doctor/pending`, { doctorId: patientData?.doctorId }).then((res) => {
      setPatients(res.data)
      setFilterPatients(res.data)
    })
  }, [])

  useEffect(() => {
    if (showPopup) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [showPopup]);

  const AcceptRejectHandler = (appointmentId, status) => {
    axios.post(`${import.meta.env.VITE_API_URL}/doctor/status`, { appointmentId: appointmentId, status: status }).then((res) => {
      setPatients((prevPatients) => prevPatients.filter(patient => patient.appointmentId !== appointmentId));
      setFilterPatients((prevPatients) => prevPatients.filter(patient => patient.appointmentId !== appointmentId));
      setShowPopup(false);
      setSelectedPatient(null);
      showToast(status === "Accepted" ? "Appointment accepted successfully." : "Appointment rejected...", status === "Accepted" ? "success" : "error")
    })
  }

  const filterBySearch = (name) => {
    setFilterPatients(patients.filter(patient => patient.patient.first_name.toLowerCase().includes(name.toLowerCase())))
  }

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-4">New Appointments</h1>
        <input className="px-2 border-2 border-gray-400 rounded-lg focus:border-gray-800 py-1" type="text" placeholder="Search by Patient name" onChange={(e) => { filterBySearch(e.target.value) }} />
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="h-[72.5vh] overflow-y-auto overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-green-600 text-white uppercase sticky top-0">
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Gender</th>
                <th className="px-6 py-3 text-left">Reason</th>
                <th className="px-6 py-3 text-left">Date - Time</th>
              </tr>
            </thead>
            <tbody>
              {filterPatients.map((patient, index) => (
                <tr
                  key={index}
                  className="hover:bg-green-50 cursor-pointer"
                  onClick={() => handleRowClick(patient)}
                >
                  <td className="px-6 py-3 border-b">{patient.patient.first_name} {patient.last_name}</td>
                  <td className="px-6 py-3 border-b">{patient.patient.gender}</td>
                  <td className="px-6 py-3 border-b">{patient.reason}</td>
                  <td className="px-6 py-3 border-b">{new Date(patient.date).toLocaleDateString('en-GB').replace(/\//g, '-')} - {patient.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {
        showPopup && selectedPatient && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between sticky top-0 bg-white p-4 border-b">
                <h2 className="text-xl font-bold text-gray-700">Patient Details</h2>
                <button className="text-2xl" onClick={closePopup}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="flex flex-col md:flex-row p-6">
                <div className="w-full md:w-1/2 flex justify-center items-center p-4">
                  <img className="w-full h-auto max-h-96 object-cover rounded-lg" src={selectedPatient.patient.profilepic} alt="Patient" />
                </div>
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
                  <div>
                    <p className="mb-2"><strong>Name:</strong> {selectedPatient.patient.first_name} {selectedPatient.patient.last_name}</p>
                    <p className="mb-2"><strong>Gender:</strong> {selectedPatient.patient.gender}</p>
                    <p className="mb-2"><strong>Phone:</strong> {selectedPatient.patient.phone_no}</p>
                    <p className="mb-2"><strong>Email:</strong> {selectedPatient.patient.email}</p>
                    <p className="mb-2"><strong>Appointment Date:</strong> {new Date(selectedPatient.date).toLocaleDateString('en-GB').replace(/\//g, '-')} - {selectedPatient.time}</p>
                    <p className="mb-4"><strong>Reason:</strong> {selectedPatient.reason}</p>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => { AcceptRejectHandler(selectedPatient.appointmentId, "Accepted") }}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => { AcceptRejectHandler(selectedPatient.appointmentId, "Rejected") }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default NewAppointments;
