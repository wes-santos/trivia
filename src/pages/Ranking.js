import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid';
import { resetGame } from '../actions';
import { getLocalStorage } from '../components/utils/localStorage';
import requestGravatar from '../components/utils/requestGravatar';
import './ranking.css';

class Ranking extends React.Component {
  state = {
    ranking: getLocalStorage('ranking'),
  }

  handleClick = () => {
    const { dispatch } = this.props;
    dispatch(resetGame());
  }

  render() {
    const { ranking } = this.state;
    // ranking.sort((a, b) => b - a);
    ranking.sort((b, a) => {
      const menorScore = -1;
      const maiorScore = 1;
      if (a.score > b.score) {
        return maiorScore;
      }
      if (a.score < b.score) {
        return menorScore;
      }
      return 0;
    });
    return (
      <div className="ranking-container">
        <h1 data-testid="ranking-title">Ranking</h1>
        { ranking.map((item, index) => (
          <div className="ranking-infos" key={ nanoid() }>
            <img
              src={ requestGravatar(item.picture) }
              alt="player"
            />
            <div>
              <h2 data-testid={ `player-name-${index}` }>
                { item.name}
              </h2>
              <h3 data-testid={ `player-score-${index}` }>
                Pontos:
                {' '}
                { item.score }
              </h3>
            </div>
          </div>
        ))}
        <Link to="/">
          <button
            type="button"
            data-testid="btn-go-home"
            onClick={ this.handleClick }
          >
            Jogar Novamente
          </button>
        </Link>
      </div>);
  }
}

Ranking.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Ranking);

// sort() ref from W3schools: https://www.w3schools.com/js/js_array_sort.asp
