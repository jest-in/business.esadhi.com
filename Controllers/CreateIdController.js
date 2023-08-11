const Id = require("../Models/idModel");

module.exports = async (req, res, next) => {
  let i = 0;
  while (i < 1000) {
    const userId = generateUniqueUserId();
    let userExists = await Id.collection.findOne({ userId });
    if (!userExists) {
      i++;
      Id.create({ userId }).catch((err) => console.log(err));
    }
  }
  res.json({
    status: "success",
  });
};

function generateUniqueUserId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const idLength = 14;
  let userId = "";

  for (let i = 0; i < idLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    userId += characters.charAt(randomIndex);
  }

  return userId;
}
