import * as firebase from 'firebase';


export function unixToShortDate(unix) {
  console.log(unix);
  const newDate = new Date(Number(unix));
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

export function getAvailabilityArray(userId) {
  return firebase.database().ref(`users/${userId}/availability/`).once('value').then((availability) => {
    const availabilities = [];
    for (const key in availability.val()){
      availabilities.push(availability.val()[key])
    }
    return availabilities;
  });
}
