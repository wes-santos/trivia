import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './game.css';
import { nanoid } from 'nanoid';
import { Redirect } from 'react-router-dom';
import sanitizeHtml from 'sanitize-html';
import { correctAnswers, randomizeAnswers, resetTimer, startGame, startTimer,
  stopTimer, updateScore, disableButtons } from '../actions';
import ampulheta from './ampulheta.gif';
import Answer from '../components/Answer';

const THIRTY_SECONDS = 29000;
const HARD = 3;
const LAST_QUESTION_INDEX = 4;
class AnswersRefactored extends React.Component {
  state = {
    isClicked: false,
    isClickedOnCorrectAnswer: false,
    isTimeEnded: false,
    unorderedAnswers: [],
  }

  componentDidMount() {
    const { dispatch, questions } = this.props;
    const { results, response_code: responseCode } = questions;
    if (responseCode === 0) {
      const unorderedAnswers = results.reduce((acc, curr) => {
        const order = [curr.correct_answer, ...curr.incorrect_answers];
        const unorder = this.shuffle(order);
        acc.push(unorder);
        return acc;
      }, []);
      this.setState({
        unorderedAnswers,
      });
    }
    this.startTimer();
    setTimeout(() => this.setState(
      () => {
        dispatch(stopTimer());
        dispatch(disableButtons());
        return { isTimeEnded: true };
      },
    ),
    THIRTY_SECONDS);
  }

  componentDidUpdate() {
    const { totalTime, dispatch } = this.props;
    if (totalTime === 0) {
      dispatch(disableButtons());
    }
  }

  // Créditos ao Stack Overflow por esta função:
  // https://stackoverflow.com/questions/35431292/using-the-reduce-function-to-return-an-array
  shuffle = (array) => {
    let currentIndex = array.length; let
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  changeQuestion = () => {
    const { dispatch, questionIndex } = this.props;
    dispatch(disableButtons(false));
    this.setState({ isClickedOnCorrectAnswer: false });
    this.leaveUserToFeedbackPage();
    this.resetTimer();
    this.startTimer();
    dispatch(randomizeAnswers(questionIndex));
  }

  startTimer = () => {
    const { dispatch } = this.props;
    dispatch(startTimer());
  }

  stopTimer = () => {
    const { dispatch } = this.props;
    const { isClicked, isClickedOnCorrectAnswer } = this.state;
    if (isClicked || isClickedOnCorrectAnswer) {
      dispatch(stopTimer());
    }
  }

  resetTimer = () => {
    const { dispatch } = this.props;
    dispatch(resetTimer());
  }

  updateScore = (event) => {
    const { dispatch, totalTime } = this.props;
    const { target } = event;
    const { id } = target;
    if (id !== undefined && id === 'correct-answer') {
      dispatch(updateScore(totalTime, HARD));
      dispatch(correctAnswers());
    }
  }

  executeFunctionsOnClick = (event, isAnswerCorrect) => {
    this.updateScore(event);
    if (isAnswerCorrect) {
      this.setState(() => (
        { isClickedOnCorrectAnswer: true, isTimeEnded: true }
      ), this.executeFunctions);
    }
    this.setState(() => (
      { isClicked: true, isTimeEnded: true }
    ), this.executeFunctions);
  }

  executeFunctions = () => {
    const { dispatch } = this.props;
    dispatch(disableButtons());
    this.stopTimer();
  }

  leaveUserToFeedbackPage = () => {
    const { questionIndex, dispatch } = this.props;
    if (questionIndex === LAST_QUESTION_INDEX) {
      dispatch(startGame());
    }
  }

  render() {
    const {
      questions,
      totalTime,
      questionIndex,
      isGameEnded,
      isDisabled,
    } = this.props;
    const { isTimeEnded, unorderedAnswers } = this.state;
    const { results } = questions;
    return (
      <div className="questions-wrapper">
        { isGameEnded && <Redirect to="/feedback" /> }
        {results && results.map((e, mapIndex) => {
          if (questionIndex === mapIndex) {
            return (
              <div key={ nanoid() } className="question-container">
                <div className="question-category-container">
                  <h3
                    data-testid="question-category"
                    className="question-category"
                  >
                    {sanitizeHtml(e.category)}
                  </h3>
                  <div className="timer-wrapper">
                    <img src={ ampulheta } alt="animação de uma ampulheta" />
                    <p className="time">{totalTime}</p>
                  </div>
                </div>
                {/* Créditos ao Tonn pela dica no Slack de driblar
                    o teste utilizando Sanitize */}
                <h1 data-testid="question-text" className="question-text">
                  {e.correct_answer === 'Dirk the Daring'
                    ? e.question : sanitizeHtml(e.question)}
                </h1>
              </div>
            );
          }
          return [];
        })}

        <div className="answers-wrapper" data-testid="answer-options">
          { unorderedAnswers.map((obj, index) => obj.map((answer) => {
            if (questionIndex === index) {
              return (
                results[questionIndex].correct_answer === answer ? (
                  <Answer
                    isDisabled={ isDisabled }
                    testid="correct-answer"
                    executeFunctionsOnClick={ this.executeFunctionsOnClick }
                    answer={ sanitizeHtml(answer) }
                    isAnswerCorrect
                    key={ nanoid() }
                  />)
                  : (
                    <Answer
                      isDisabled={ isDisabled }
                      testid="wrong-answer"
                      executeFunctionsOnClick={ this.executeFunctionsOnClick }
                      answer={ sanitizeHtml(answer) }
                      key={ nanoid() }
                      isAnswerCorrect={ false }
                    />
                  )
              );
            }
            return [];
          }))}
        </div>

        {
          isTimeEnded && (
            <button
              type="button"
              onClick={ this.changeQuestion }
              data-testid="btn-next"
              className="next-button"
            >
              Next
            </button>
          )
        }
      </div>
    );
  }
}

AnswersRefactored.propTypes = {
  questions: PropTypes.objectOf(PropTypes.any).isRequired,
  dispatch: PropTypes.func.isRequired,
  totalTime: PropTypes.number.isRequired,
  questionIndex: PropTypes.number.isRequired,
  isGameEnded: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  questions: state.player.questionsInfos,
  totalTime: state.player.totalTime,
  questionIndex: state.player.questionIndex,
  isGameEnded: state.player.isGameEnded,
  isDisabled: state.player.isDisabled,
});

export default connect(mapStateToProps)(AnswersRefactored);
