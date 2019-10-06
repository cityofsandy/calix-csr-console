const getFmsTimestamp = (timestamp) => {
  const currentDate = new Date(timestamp);
  return currentDate.toLocaleString();
};

const getFmsDate = (timestamp) => {
  const currentDate = new Date(timestamp);
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  return (month + 1) + '/' + date + '/' + year;
};

const getFmsDateIso8601 = (timestamp) => {
  const currentDate = new Date(timestamp);
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  return year + '-' + (month + 1) + '-' + date;
};


export { getFmsTimestamp, getFmsDate, getFmsDateIso8601 };
