let statusName = (categoryId) => {
  let name = ['Junior', 'Middle', 'Senior', 'Company manager', 'JS creator'];
  return name[categoryId - 1];
};

module.exports = {
  statusName,
};
