const randomCode = async () => {
  const verifyCode = await Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  return verifyCode;
};

module.exports = {
  randomCode,
};
