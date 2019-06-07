const fs = require('fs');
const RandExp = require('randexp');

const generateRandomString = (characters, strLength) => {
  let str = '';
  for (let i = 0; i < strLength; i++) {
    str += new RandExp(characters, ).gen();
  }
  return str;
}

const generateRandomId = generateRandomString({
  alphabet: /[a-zA-Z0-9_]/,
  strLength: 10,
});

const generateRandomUsername = () => (
  'anonymous' + generateRandomString(/[0-9]/, 5)
)

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
  generateRandomUsername
}