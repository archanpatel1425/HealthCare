import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';


const Dashboard = () => {

  // useEffect(()=>{
    const myData = useSelector((state) => state.auth);
    console.log(myData)
  // },[])

  return (
    <div>
      <div className="p-6 bg-gray-50 flex-1">
          <h2 className="text-2xl font-bold text-gray-700">Welcome, Doctor!</h2>
          <p className="mt-2 text-gray-600">Here's your panel overview.</p>
        </div>
    </div>
  )
}

export default Dashboard
