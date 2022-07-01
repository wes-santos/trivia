const fetchToken = async () => {
  const url = 'https://opentdb.com/api_token.php?command=request';
  const response = await fetch(url);
  const dataJson = await response.json();
  return dataJson;
};

// export const getQuestionsAndAnswers = async (token) => {
//   const url = `https://opentdb.com/api.php?amount=5&token=${token}`;
//   const response = await fetch(url);
//   const dataJson = await response.json();
//   return dataJson;
// };

export default fetchToken;

// ref from Promise.resolve() MDN https://shortest.link/3pjj
// ref from Response.ok MDN https://shortest.link/3fFs
// ref from Promise.reject() MDN https://shortest.link/3pju
