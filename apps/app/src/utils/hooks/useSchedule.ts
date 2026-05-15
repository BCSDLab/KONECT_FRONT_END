export const dateUtils = (year: number, month: number, day: number) => {
  const isCurrentMonth = (date: Date) => date.getFullYear() === year && date.getMonth() + 1 === month;

  const isSelectedDay = (date: Date) =>
    date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day;

  const isSunday = (date: Date) => date.getDay() === 0;

  const getMonthDateList = (): Date[] => {
    const currentMonth = month - 1;
    const currentMonthFirstDay = new Date(year, currentMonth, 1).getDay();
    const currentMonthLastDate = new Date(year, month, 0).getDate();

    const prevMonthDateList = Array.from(
      { length: currentMonthFirstDay },
      (_, index) => new Date(year, currentMonth, -currentMonthFirstDay + index + 1)
    );

    const currentMonthDateList = Array.from(
      { length: currentMonthLastDate },
      (_, index) => new Date(year, currentMonth, index + 1)
    );

    const lastDayOfMonth = new Date(year, currentMonth, currentMonthLastDate);
    const remainingDaysInWeek = lastDayOfMonth.getDay() === 6 ? 0 : 6 - lastDayOfMonth.getDay();

    const nextMonthDateList = Array.from(
      { length: remainingDaysInWeek },
      (_, index) => new Date(year, month, index + 1)
    );

    return [...prevMonthDateList, ...currentMonthDateList, ...nextMonthDateList];
  };

  return {
    isCurrentMonth,
    isSelectedDay,
    isSunday,
    getMonthDateList,
  };
};
