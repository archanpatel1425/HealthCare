import React from 'react';
import HeroSectionImage from '../../assets/HeroSectionImage.jpg';
const HeroSection = () => {
    return (
        <div className=''>
            <div className="h-screen pt-16">
                <div className="bg-[#ebf8ef] w-full h-full ">
                    <div className='flex justify-between items-center mx-24'>
                        <div>
                            <div className=' text-5xl font-bold'>
                                Serving Your Health
                                Needs Is Our Priority
                            </div>
                            <div></div>
                            <button className='text-white bg-green-600 p-4 rounded-full mt-8 font-bold'>book An Appointment</button>
                        </div>
                        <img src={HeroSectionImage} alt="" className='h-[70vh] w-[35vw]' />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HeroSection;
