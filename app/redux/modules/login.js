import { createAction, handleActions } from 'redux-actions';

export const setUser = createAction('SET_USER');

const initialState = {};

export const getUser = state => state.user;

export default handleActions({
  SET_USER: (state, action) => action.payload,
}, initialState);
