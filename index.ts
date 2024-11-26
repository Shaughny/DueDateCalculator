const START_HOUR = 9;
const END_HOUR = 17;


/*   MAIN FUNCTION  */




export const CalculateDueDate = (
  submitTime: Date,
  turnaroundHours: number
): Date => {
  validateTimes(submitTime, turnaroundHours);
  let dueDate = new Date(submitTime);
  dueDate = processHours(dueDate, turnaroundHours);
  dueDate = processMinutes(dueDate);
  return dueDate;
};




/*   HELPER FUNCTIONS  */



// Function to roll over the days and hours
const processHours = (dueDate: Date, turnaroundHours: number): Date => {
  while (turnaroundHours > 0) {
    const currentDay = dueDate.getDay();
    const currentHours = dueDate.getHours();
    const hoursLeftToday = END_HOUR - currentHours;

    // Check if it's the weekend, then move to next day
    if (isWeekend(currentDay)) {
      dueDate.setDate(dueDate.getDate() + 2);
      continue;
    }

    // Check if the remaining hours can be done today, if not, roll over to the next day
    if (hoursLeftToday > turnaroundHours) {
      dueDate.setHours(currentHours + turnaroundHours);
      break;
    } else {
      turnaroundHours -= hoursLeftToday;
      dueDate.setHours(START_HOUR);
      dueDate.setDate(dueDate.getDate() + 1);
    }
  }
  return dueDate;
};

// Function to roll over the days and minutes if the due date is after the working hours
const processMinutes = (dueDate: Date): Date => {
  const currentHours = dueDate.getHours();

  // Check if the due date is after the working hours, then roll over to the next day
  if (currentHours >= END_HOUR) {
    dueDate.setDate(dueDate.getDate() + 1);
    dueDate.setHours(START_HOUR);
  }

  // Check if the due date is on the weekend, then roll over to Monday
  while (isWeekend(dueDate.getDay())) {
    dueDate.setDate(dueDate.getDate() + 2);
    dueDate.setHours(START_HOUR);
  }
  return dueDate;
};

const isWeekend = (day: number): boolean => {
  return day === 6 || day === 0;
};

// Function to validate the input times
const validateTimes = (submitTime: Date, turnaroundHours: number): void => {
  if (turnaroundHours < 0) {
    throw new Error("Turnaround time cannot be negative");
  }

  const hour = submitTime.getHours();
  if (hour < START_HOUR || hour >= END_HOUR) {
    throw new Error("Submit time is outside of working hours");
  }

  const day = submitTime.getDay();
  if (day === 0 || day === 6) {
    throw new Error("Submit time must be on a workday");
  }
};
