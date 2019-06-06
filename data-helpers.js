const fs = require('fs');

const generateRandomId = (alphabet => {
  const alphabetLength = alphabet.length;
  const randoIter = (key, n) => {
    if (n === 0) {
      return key;
    }
    const randoIndex = Math.floor(Math.random() * alphabetLength);
    const randoLetter = alphabet[randoIndex];
    return randoIter(key + randoLetter, n - 1);
  };
  return () => randoIter('', 10);
})('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

const addRandomId = msg => ({
  ...msg,
  id: generateRandomId()
})

const addRandomIdToMsgs = messages => (
  messages.map(addRandomId)
);

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

module.exports = {
  generateRandomId,
  getRandomColor,
}