import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { fetchquestionsInfos, setPlayerInfos, fetchToken } from '../actions';
import './home.css';
import trivia from '../trivia.png';

class Home extends Component {
  state = {
    isButtonDisabled: true,
    goToSettings: false,
  }

  handleChange = ({ target: { name, value } }) => {
    const { dispatch } = this.props;
    // Envia o nome da chave igual está no estado global e o valor que ela deve receber para que ele seja atualizado
    dispatch(setPlayerInfos(name, value));
    this.validation();
  }

  handleClickSettings = () => {
    this.setState(
      { goToSettings: true },
    );
  }

  validation = () => {
    const { playerName, playerEmail } = this.props;
    if (playerEmail.includes('@')
    && playerEmail.includes('.co')
    && playerName.length > 0) {
      this.setState(
        { isButtonDisabled: false },
      );
    } else {
      this.setState(
        { isButtonDisabled: true },
      );
    }
  }

  handleClick = async () => {
    const { dispatch } = this.props;
    // const token = localStorage.getItem('token');
    dispatch(fetchToken());
    dispatch(fetchquestionsInfos());
    // } else {
    //   dispatch(fetchquestionsInfos());
    // }
  }

  render() {
    const { isButtonDisabled, goToSettings } = this.state;
    const { isFetched } = this.props;
    return (
      <div className="home-wrapper">
        { goToSettings && <Redirect to="/settings" /> }
        { isFetched && <Redirect to="/game" /> }
        <form className="login-form">
          <div className="form-wrapper">
            <img src={ trivia } alt="trivia-game-logo" />
            <input
              name="name"
              type="text"
              onKeyUp={ this.handleChange }
              data-testid="input-player-name"
              placeholder="Digite seu nome aqui"
              required
            />
            <input
              name="gravatarEmail"
              type="email"
              onKeyUp={ this.handleChange }
              data-testid="input-gravatar-email"
              placeholder="Digite seu e-mail"
              required
            />
            <button
              type="button"
              onClick={ this.handleClick }
              data-testid="btn-play"
              className="active-login-button"
              disabled={ isButtonDisabled }
            >
              Play
            </button>
            <button
              type="button"
              onClick={ this.handleClickSettings }
              data-testid="btn-settings"
              className="settings-button"
            >
              Configurações
            </button>
          </div>
        </form>
      </div>);
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
  playerName: PropTypes.string.isRequired,
  playerEmail: PropTypes.string.isRequired,
  isFetched: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  playerName: state.player.name,
  playerEmail: state.player.gravatarEmail,
  isFetched: state.player.isFetched,
});

export default connect(mapStateToProps)(Home);
