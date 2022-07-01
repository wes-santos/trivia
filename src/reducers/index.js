import { combineReducers } from 'redux';
import playerReducer from './player';
import token from './tokenReducer';
// import amountAnswers from './answers';

const rootReducer = combineReducers({ player: playerReducer, token });

export default rootReducer;
