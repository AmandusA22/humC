
class LoginStore {

  get token() {
    const value = AsyncStorage.getItem('token');

    if (value === null) {
      LogService.log('in value is null');
      // resolve('');
    } else {
      LogService.log('value is not null');
      // resolve(value)
    }
      //  resolve(value);
  }
}
