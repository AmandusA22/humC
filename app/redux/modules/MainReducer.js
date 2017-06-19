import { SaveUserInfo, SAVE_USER_INFO } from './saveUserInfo';
//import { SetScreenType, SET_SCREEN_TYPE } from './SetScreenType';

export const MainReducer = (state = {}, action) => {
  console.log('in main reducer');
  switch (action.type) {
    case SAVE_USER_INFO:
      return Object.assign({}, state, SaveUserInfo(state, action));
    // case 'SET_SCREEN_TYPE':
    //   return Object.assign({}, state, SetScreenType(state, action));
    default: return state;
  }
};
