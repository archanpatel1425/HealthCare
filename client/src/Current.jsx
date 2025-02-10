import { useState, useEffect } from "react";

const Timestamp = () => {
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    const updateTimestamp = () => {
      const now = new Date();
      setTimestamp(now.toISOString().replace("T", " ").slice(0, -1));
      
    };
    
    updateTimestamp();
    const interval = setInterval(updateTimestamp, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  return <div onClick={()=>{}}>{timestamp}</div>;
};

export default Timestamp;
