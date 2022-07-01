import md5 from 'crypto-js/md5';

const requestGravatar = (email) => {
  const imgGravatar = `https://www.gravatar.com/avatar/${md5(email).toString()}`;
  return imgGravatar;
};

export default requestGravatar;
