import React from 'react'
import PatientProfile from '../../components/Patient/PatientProfile'
import RecentAppointments from '../../components/Patient/RecentAppointments'

const Dashboard = () => {
  return (
    <div className=''>
      <PatientProfile/>
      <RecentAppointments/>
    </div>
  )
}

export default Dashboard