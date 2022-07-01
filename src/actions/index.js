export const SET_PLAYER_INFO = 'SET_PLAYER_INFO';
export const FIRST_QUESTIONS_FETCH = 'FIRST_QUESTIONS_FETCH';
export const SECOND_QUESTIONS_FETCH = 'SECOND_QUESTIONS_FETCH';
export const USER_TOKEN = 'USER_TOKEN';
export const UPDATE_SCORE = 'UPDATE_SCORE';
export const TIMER_START = 'TIMER_START';
export const TIMER_TICK = 'TIMER_TICK';
export const TIMER_STOP = 'TIMER_STOP';
export const RESET_TIMER = 'RESET TIMER';
export const CORRECT_ANSWERS = 'CORRECT_ANSWERS';
export const RESET_CORRECT_ANSWERS = 'RESET_CORRECT_ANSWERS';
export const RANDOMIZE_ANSWERS = 'RANDOMIZE_ANSWERS';
export const RESET_QUESTIONS_INDEX = 'RESET_QUESTIONS_INDEX';
export const START_GAME = 'START_GAME';
export const RESET_GAME = 'RESET_GAME';
export const DISABLE_BUTTONS = 'DISABLE_BUTTONS';

const TEN = 10;
const ONE_SECOND = 1000;

// Envia um objeto na chave payload contendo o nome da chave a ser alterada no estado e o valor que ela deve receber
export const setPlayerInfos = (key, info) => ({
  type: SET_PLAYER_INFO,
  payload: { [key]: info },
});

export const firstQuestionsFetch = (infos) => ({
  type: FIRST_QUESTIONS_FETCH,
  payload: infos,
});

export const secondQuestionsFetch = (infos) => ({
  type: SECOND_QUESTIONS_FETCH,
  payload: infos,
});

export const userToken = (token) => ({ type: USER_TOKEN, token });

export const randomizeAnswers = (indexOfActualQuestion) => ({
  type: RANDOMIZE_ANSWERS,
  payload: indexOfActualQuestion,
});

export const fetchToken = () => async (dispatch) => {
  const url = 'https://opentdb.com/api_token.php?command=request';
  const tokenApiResponse = await fetch(url);
  const dataJson = await tokenApiResponse.json();
  localStorage.setItem('token', dataJson.token);
  const token = localStorage.getItem('token');
  const questionsApiResponse = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
  const data = await questionsApiResponse.json();
  dispatch(firstQuestionsFetch(data));
  return dispatch(userToken(dataJson.token));
};

export const fetchquestionsInfos = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const data = await response.json();
    dispatch(secondQuestionsFetch(data));
  } catch (error) {
    await dispatch(fetchToken());
    const token = localStorage.getItem('token');
    const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
    const data = await response.json();
    dispatch(secondQuestionsFetch(data));
  }
};

export const updateScore = (timer, dificuldade) => ({
  type: UPDATE_SCORE,
  payload: TEN + (timer * dificuldade),
});

// Créditos ao artigo do Gustavo Machado no Medium pela explicação de como fazer um timer com actions via Redux:
// https://medium.com/@machadogj/timers-in-react-with-redux-apps-9a5a722162e8
let timer = null;

const timerTick = () => ({ type: TIMER_TICK });

export const startTimer = () => (dispatch) => {
  clearInterval(timer);
  timer = setInterval(() => dispatch(timerTick()), ONE_SECOND);
  dispatch(timerTick());
};

export const stopTimer = () => {
  clearInterval(timer);
  return { type: TIMER_STOP };
};

export const resetTimer = () => ({ type: RESET_TIMER });

export const correctAnswers = () => ({
  type: CORRECT_ANSWERS,
});

export const resetCorrectAnswers = () => ({
  type: RESET_CORRECT_ANSWERS,
});

export const resetQuestionsIndex = () => ({
  type: RESET_QUESTIONS_INDEX,
});

export const startGame = () => ({
  type: START_GAME,
});

export const resetGame = () => ({
  type: RESET_GAME,
});

export const disableButtons = (bool = true) => ({
  type: DISABLE_BUTTONS,
  payload: bool,
});
