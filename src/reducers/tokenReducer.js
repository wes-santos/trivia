import { USER_TOKEN } from '../actions';

const INITIAL_STATE = '';

const token = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  case USER_TOKEN: return action.token;
  default: return state;
  }
};

export default token;
