import React from 'react';
import { connect } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import './header.css';

class Header extends React.Component {
  render() {
    const { playerName, email, score } = this.props;
    return (
      <header>
        <div className="player-infos-wrapper">
          <img
            src={ `https://www.gravatar.com/avatar/${md5(email).toString()}` }
            alt="header-profile"
            data-testid="header-profile-picture"
          />
          <div className="player-infos-container">
            <div className="player-name-wrapper">
              <p data-testid="header-player-name" className="player-name-title">
                Jogador:
              </p>
              <p className="player-name" data-testid="header-player-name">
                {playerName}
              </p>
            </div>
            <div className="score-wrapper">
              <p className="score-title">
                Pontuação:
              </p>
              <p data-testid="header-score" className="score">
                { score }
              </p>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  playerName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  playerName: state.player.name,
  email: state.player.gravatarEmail,
  score: state.player.score,
});

export default connect(mapStateToProps)(Header);
