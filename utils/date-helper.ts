const MILLISECSPERDAY = 86400000;

export const formatHour = (hour: number) => {
  if (hour === 0) return "12:00 AM ";
  else if (hour === 12) return "12:00 PM ";
  else if (hour < 12) return `${hour}:00 AM `;
  else return `${hour - 12}:00 PM `;
};

export const formatDueDate = (due: Date) => {
  return due.getMonth() + 1 + "/" + due.getDate() + "/" + due.getFullYear();
};

// returns 0 if d1 and d2 are on the same day
// else returns number of days from d1 to d2 (negative if d1 is passed d2)
export const numDaysBetween = (d1: Date, d2: Date) => {
  const numDays = Math.round((d2.getTime() - d1.getTime()) / MILLISECSPERDAY);

  // this deals with the problem of getTime() using UTC instead of local timezone
  if (numDays === 0 && d1.getDay() !== d2.getDay()) {
    return d1.getTime() < d2.getTime() ? 1 : -1;
  } else if ((numDays === 1 || numDays === -1) && d1.getDay() === d2.getDay()) {
    return 0;
  }

  return numDays;
};

// start and end inclusive
// apply is a function that should take a date object as its only parameter
export const forEachDayBetween = (
  startDate: Date,
  endDate: Date,
  apply: (d: Date) => Date
) => {
  const result = [];
  let idx = 0;
  for (
    let i = startDate.getTime();
    i <= endDate.getTime();
    i += MILLISECSPERDAY
  ) {
    if (idx > 1000) break; // stop after 1000 results
    result.push(apply(new Date(i)));
    idx++;
  }
  return result;
};
