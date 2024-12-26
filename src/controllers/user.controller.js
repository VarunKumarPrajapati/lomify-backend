const { createUser, login, updateUser } = require("../services/userService");

exports.createUser = async (req, res) => {
  await createUser(req.body);
  res.status(204).send();
};

exports.login = async (req, res) => {
  const token = await login(req.body);

  res.cookie("session", token);
  res.status(204).send();
};

exports.updateUser = async (req, res) => {
  await updateUser(req.user._id, req.body);
  res.status(204).send();
};
