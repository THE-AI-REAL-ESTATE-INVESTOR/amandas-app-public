export function generateTimeSlots(start: string, end: string): string[] {
  const slots: string[] = [];
  const startTime = new Date(`2024-01-01 ${start}`);
  const endTime = new Date(`2024-01-01 ${end}`);
  
  // Generate slots in 1-hour increments
  const current = new Date(startTime);
  while (current < endTime) {
    slots.push(current.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }));
    current.setHours(current.getHours() + 1);
  }
  
  return slots;
}

export function getAvailableTimeSlots(date: Date | undefined): string[] {
  if (!date) return [];
  
  const day = date.getDay();
  
  // Sunday is closed
  if (day === 0) return [];
  
  // Saturday has different hours
  if (day === 6) {
    return generateTimeSlots("10:00 AM", "4:00 PM");
  }
  
  // Weekdays
  return generateTimeSlots("9:00 AM", "6:00 PM");
}
