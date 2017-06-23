import { SaveUserInfo, SAVE_USER_INFO } from './saveUserInfo';
import { SaveAppState, SAVE_APP_STATE } from './saveAppState';
//import { SetScreenType, SET_SCREEN_TYPE } from './SetScreenType';

export const MainReducer = (state = {}, action) => {
  console.log('in main reducer');
  switch (action.type) {
    case SAVE_USER_INFO:
      return Object.assign({}, state, SaveUserInfo(state, action));
    case SAVE_APP_STATE:
      return Object.assign({}, state, SaveAppState(state, action));
    default: return state;
  }
};
