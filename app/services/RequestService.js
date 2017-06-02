import { BASE_URL } from '../constants';
import LoginStore from '../stores/LoginStore.js';
import { AsyncStorage } from 'react-native';

class RequestService {

  get(uri) {
    let url = BASE_URL + uri;
    // LogService.log('GET_URL', url);
    if (url.indexOf('?') === -1) {
      url = `${url}?access_token=${LoginStore.token}`;
    } else {
      url = `${url}&access_token=${LoginStore.token}`;
    }
    const promise = fetch({
      url,
      method: 'GET',
      type: 'json',
      //crossOrigin: true,
    }).then(response => response.json());

    // promise.fail(this._failedRequest);

    return promise;
  }

  post(uri, data) {
    console.log('post');
    console.log(data);
    return new Promise((resolve) => {
      console.log('inside post');
      let url = BASE_URL + uri;
    // LogService.log('POST_URL', url);
      AsyncStorage.getItem('token').then((token) => {
        if (url.indexOf('?') === -1) {
          url = `${url}?access_token=${token}`;
        } else {
          url = `${url}&access_token=${token}`;
        }
    // return undefined for some reason.
        fetch(
          url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }).then(response => console.log(response));
        // promise.fail(this._failedRequest);

        resolve();
      }).done();
      /* wrk fetch
      request({
        url: `${BASE_URL}/user/me?access_token=${token}`,
        method: 'GET',
        crossOrigin: true,
        type: 'json',
      }).then(
        (response) => {
          resolve({ token, user: response });
          LoginActions.loginUser(token, response);
          // FeedsActions.search(response.profile_preferences);
        },
        (err) => {
          reject(err);
        },
      );
      */
    });
  }

}

export default new RequestService();
