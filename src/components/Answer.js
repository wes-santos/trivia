import React from 'react';
import PropTypes from 'prop-types';

class Answer extends React.Component {
  render() {
    const {
      isDisabled,
      executeFunctionsOnClick,
      testid,
      answer,
      isAnswerCorrect } = this.props;
    return (
      <button
        type="button"
        disabled={ isDisabled }
        data-testid={ testid }
        className={ testid }
        id={ testid }
        onClick={ (event) => executeFunctionsOnClick(event, isAnswerCorrect) }
      >
        {answer}
      </button>
    );
  }
}

Answer.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  executeFunctionsOnClick: PropTypes.func.isRequired,
  testid: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
  isAnswerCorrect: PropTypes.bool.isRequired,
};

export default Answer;
