import * as firebase from 'firebase';


export function unixToShortDate(unix) {
  console.log(unix);
  const newDate = new Date(Number(unix));
  const dateString = `${newDate}`;
  console.log(dateString);
  const dateArr = dateString.split(' ');
  console.log(dateArr);
  const show = dateArr[1] + ' ' + dateArr[2] + ' ' + dateArr[3];
  return show;
}

export function mapStateToProps(store) {
  return { reduxStoreProps: store };
}

export function getAvailabilityArray(userId) {
  console.log('in getAvailabilityArray')
  return firebase.database().ref(`users/${userId}/availability/`).once('value').then((availability) => {
    const availabilities = [];
    for (const key in availability.val()){
      availabilities.push(availability.val()[key])
    }
    return availabilities;
  });
}

export function ifURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}
