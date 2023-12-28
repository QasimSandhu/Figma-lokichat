export const getFirstDayOfCurrentMonth = () => {
    const currentDate = new Date();
    return new Date( currentDate.getFullYear(), currentDate.getMonth(), 1);
}