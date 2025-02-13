const generateDateWiseSlots = (availability, schedule, days = 30) => {
    const timeToMinutes = (time) => {
      const [timeString, period] = time.split(' ');
      let [hours, minutes] = timeString.split(':').map(Number);
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
  
    const minutesToTime = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    };
  
    const today = new Date();
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(today.getDate() + i);
      return date.toISOString().split('T')[0];
    });
  
    const slotsByDate = {};
  
    dates.forEach((date) => {
      const { from, to } = availability.time;
      const startMinutes = timeToMinutes(from);
      const endMinutes = timeToMinutes(to);
  
      const dayOfWeek = new Date(date).getDay();
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  
      if (!availability.days.includes(dayName)) {
        return;
      }
  
      const bookedTimes = schedule
        .filter(appt => new Date(appt.date).toISOString().split('T')[0] === date)
        .map(appt => timeToMinutes(appt.time));
  
      const slots = [];
  
      for (let time = startMinutes; time < endMinutes; time += 30) {
        const slotFrom = minutesToTime(time);
        const slotTo = minutesToTime(time + 30);
        const isBooked = bookedTimes.includes(time);
  
        slots.push({ from: slotFrom, to: slotTo, available: !isBooked });
      }
  
      slotsByDate[date] = slots;
    });
  
    return slotsByDate;
  };
  