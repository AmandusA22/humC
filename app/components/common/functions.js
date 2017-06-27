export function unixToShortDate(unix) {
  console.log(unix);
  const newDate = new Date(unix * 1000);
  const dateString = `${newDate}`;
  console.log(dateString);
  const dateArr = dateString.split(' ');
  console.log(dateArr);
  const show = dateArr[1] + ' ' + dateArr[2];
  return show;
}

export function mapStateToProps(store) {
  return { reduxStoreProps: store };
}
