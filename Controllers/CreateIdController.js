const xlsx = require("xlsx");
var path = require("path");
const Id = require("../Models/idModel");

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

module.exports.createIds = async (req, res, next) => {
  let i = 0;
  while (i < 1000) {
    const userId = generateUniqueUserId();
    if (!(await Id.collection.findOne({ userId }))) {
      i++;
      Id.create({ userId, status: "created" }).catch((err) => console.log(err));
    }
  }
  res.json({
    status: "success",
  });
};

module.exports.downloadIds = async (req, res, next) => {
  const workSheetColumnNames = [Id];
  const workSheetName = "Ids";
  const filepath = "./Ids.xlsx";

  const IdList = await Id.find({});

  const exportToExcel = (
    IdList,
    workSheetColumnNames,
    workSheetName,
    filepath
  ) => {
    const data = IdList.map((user) => [user.userId]);
    const workBook = xlsx.utils.book_new();
    const workSheetData = [workSheetColumnNames, ...data];
    const workSheet = xlsx.utils.aoa_to_sheet(workSheetData);
    xlsx.utils.book_append_sheet(workBook, workSheet, workSheetName);
    xlsx.writeFile(workBook, path.resolve(filepath));
    return true;
  };

  if (exportToExcel(IdList, workSheetColumnNames, workSheetName, filepath))
    res.status(200).download(path.join(__dirname, "../", filepath));
};
