import React from 'react'
import RecentAppointments from '../../components/Patient/RecentAppointments'
const Dashboard = () => {
  return (
    <div className='overflow-y-scroll h-full w-full'>
      {/* <PatientProfile /> */}
      <RecentAppointments />
    </div>
  )
}

export default Dashboard