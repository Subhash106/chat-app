const generateMessage = (text) => {
  return {
    text,
    createdAt: Date.now(),
  };
};

module.exports = { generateMessage };
