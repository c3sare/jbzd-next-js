export default function currentDate() {
  const date = new Date();
  let currentDay = String(date.getDate()).padStart(2, "0");
  let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
  let currentYear = date.getFullYear();

  return `${currentYear}-${currentMonth}-${currentDay}`;
}
