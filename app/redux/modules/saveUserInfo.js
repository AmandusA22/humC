import _ from 'lodash';

export const SAVE_USER_INFO = 'SAVE_USER_INFO';

export const saveUserInfoAction = payload => ({
  type: SAVE_USER_INFO,
  payload,
});

export const SaveUserInfo = (state = {}, action) => {
  console.log(action);
  if (!action.payload) {
    return;
  }

  const { id, ...rest } = action.payload;
  const user = 'user';

  if (state[user] === undefined) {
    state[user] = {};
  }

  const newStateForUser = _.extend(state[id], action.payload);
  console.log(newStateForUser);

  return Object.assign({}, state, { [user]: newStateForUser });
};
