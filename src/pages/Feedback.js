import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { resetCorrectAnswers, resetGame } from '../actions';
import { setLocalStorage, getLocalStorage } from '../components/utils/localStorage';
import './feedback.css';

const CORRECT_MESSAGE = 3;
class Feedback extends React.Component {
  state = {
    feedbackMessage: '',
  }

  componentDidMount() {
    this.savePlayerInfo();
    const { correctAnswers } = this.props;
    if (correctAnswers < CORRECT_MESSAGE) {
      this.setState(
        { feedbackMessage: 'Could be better...' },
      );
    } else {
      this.setState(
        { feedbackMessage: 'Well Done!' },
      );
    }
  }

  savePlayerInfo=() => {
    const { player: { name, score, gravatarEmail: picture } } = this.props;
    const currentRanking = getLocalStorage('ranking');
    // ler o localstorage e verificar se chave ranking existe.
    if (currentRanking === null) {
      // Se não existe, cria.
      setLocalStorage('ranking', [{ name, score, picture }]);
    } else { // Se existir verifica se é o mesmo player, atualiza o score.
      const isNewPlayer = currentRanking
        .every((item) => !(item.name === name && item.picture === picture));
      const newRanking = currentRanking.map((item) => {
        if (item.name === name && item.picture === picture && item.score < score) {
          return { name, score, picture };
        }
        return item;
      });
      if (isNewPlayer) {
        newRanking.push({ name, score, picture });
      }
      setLocalStorage('ranking', newRanking);
    }

    // Se existir a chave ranking mas não é o mesmo player, crie o novo player
  }

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(resetCorrectAnswers());
    dispatch(resetGame());
  }

  render() {
    const { feedbackMessage } = this.state;
    const { score, correctAnswers } = this.props;
    return (
      <div className="feedback-container">
        <section>
          <h1 data-testid="feedback-text">{ feedbackMessage }</h1>
          <p>
            Você acertou
            {' '}
            <span data-testid="feedback-total-question">{ correctAnswers }</span>
            {' '}
            questões!
          </p>
          <p>
            Um total de
            {' '}
            <span data-testid="feedback-total-score">{ score }</span>
            {' '}
            pontos
          </p>
          <Link to="/ranking">
            <button
              type="button"
              data-testid="btn-ranking"
              className="ranking-button"
            >
              Ver Ranking
            </button>
          </Link>
          <Link to="/">
            <button
              type="button"
              data-testid="btn-play-again"
              onClick={ this.handleClick }
              className="play-again-button"
            >
              Jogar Novamente
            </button>
          </Link>
        </section>
      </div>);
  }
}

Feedback.propTypes = {
  correctAnswers: PropTypes.number.isRequired,
  score: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  player: PropTypes.shape({
    score: PropTypes.number,
    name: PropTypes.string,
    gravatarEmail: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  correctAnswers: state.player.assertions,
  score: state.player.score,
  player: state.player,
});

export default connect(mapStateToProps)(Feedback);
