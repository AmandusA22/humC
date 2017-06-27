import _ from 'lodash';

export const SAVE_APP_STATE = 'SAVE_APP_STATE';

export const saveAppStateAction = payload => ({
  type: SAVE_APP_STATE,
  payload,
});

export const SaveAppState = (state = {}, action) => {
  console.log(action);
  if (!action.payload) {
    return;
  }

  const { id, ...rest } = action.payload;
  const app_state = 'app_state';

  if (state[app_state] === undefined) {
    state[app_state] = {};
  }

  const newAppState = _.extend(state[id], action.payload);

  return Object.assign({}, state, { [app_state]: newAppState });
};
