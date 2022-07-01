import {
  FIRST_QUESTIONS_FETCH,
  SECOND_QUESTIONS_FETCH,
  SET_PLAYER_INFO,
  UPDATE_SCORE,
  TIMER_TICK,
  RESET_TIMER,
  CORRECT_ANSWERS,
  RESET_CORRECT_ANSWERS,
  RESET_GAME,
  START_GAME,
  DISABLE_BUTTONS,
} from '../actions';

const INITIAL_STATE = {
  name: '',
  assertions: 0,
  score: 0,
  gravatarEmail: '',
  questionsInfos: {},
  totalTime: 30,
  questionIndex: 0,
  randomAnswers: [],
  isFetched: false,
  isGameEnded: false,
  isDisabled: false,
};

export const LAST_QUESTION = 4;

const playerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
  // Recebe o nome ou o email para ser colocado nas chaves do estado global
  case SET_PLAYER_INFO: return { ...state, ...action.payload };
  case FIRST_QUESTIONS_FETCH: return { ...state,
    questionsInfos: action.payload,
    isFetched: true,
  };
  case SECOND_QUESTIONS_FETCH: return { ...state,
    questionsInfos: action.payload,
  };
  case UPDATE_SCORE: return { ...state, score: state.score + action.payload };
  case TIMER_TICK: return { ...state,
    totalTime: state.totalTime > 0 ? state.totalTime - 1 : 0,
  };
  case RESET_TIMER: return { ...state,
    totalTime: 30,
    questionIndex: state.questionIndex === LAST_QUESTION
      ? LAST_QUESTION
      : state.questionIndex + 1 };
  case CORRECT_ANSWERS:
    return {
      ...state,
      assertions: state.assertions + 1,
    };
  case RESET_CORRECT_ANSWERS:
    return {
      ...state,
      assertions: 0,
    };
  case START_GAME:
    return {
      ...state,
      isGameEnded: true,
    };
  case RESET_GAME:
    return {
      ...state,
      isGameEnded: false,
      isFetched: false,
      questionIndex: 0,
      score: 0,
    };
  case DISABLE_BUTTONS:
    return { ...state, isDisabled: action.payload };
  default: return state;
  }
};

export default playerReducer;
