
function addMonths(numOfMonths, date = new Date()) {
    const dateCopy = new Date(date.getTime());
  
    dateCopy.setMonth(dateCopy.getMonth() + numOfMonths);
  
    return dateCopy;
}

function addDays(numOfDays, date = new Date()) {
  const dateCopy = new Date(date.getTime());
  dateCopy.setDate(dateCopy.getDate() + numOfDays);
  return dateCopy;
}

function addHoursToDateTime(hours, startDate) {
  var confirmDate = new Date(startDate);
  var newDate = new Date(confirmDate.getTime() + (parseInt(hours) * 60 * 60 * 1000)); // add 48 hours in milliseconds
  return newDate;
}

module.exports = {addMonths, addDays, addHoursToDateTime};