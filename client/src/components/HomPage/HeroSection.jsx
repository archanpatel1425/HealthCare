import React from 'react';
import HeroSectionImage1 from '../../assets/img2.png';
const HeroSection = () => {
    return (
        <div className=''>
            <div className="h-screen pt-16">
                <div className="bg-[#d4e8db] w-full h-full ">
                    <div className='flex justify-between items-center mx-24'>
                        <div>
                            <div className=' text-5xl font-bold'>
                                Serving Your Health
                                Needs Is Our Priority
                            </div>
                            <div></div>
                            <button
                                className='text-white bg-green-600 p-4 rounded-full mt-8 font-bold'
                            >
                                book An Appointment
                            </button>
                        </div>
                        <img src={HeroSectionImage1} alt="" className='mt-8 h-[85vh] w-[40vw]' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
