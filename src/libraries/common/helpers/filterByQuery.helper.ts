export const getSortColumns = (sort, permitSort = {}) => {
  const orderBy = {};
  const orderColumns = sort.split(',');
  orderColumns.forEach((item) => {
    const column = item.split('|');

    if (Object.keys(permitSort).length) {
      if (permitSort[column[0]]) {
        column[0] = permitSort[column[0]];
        orderBy[column[0]] = column[1];
      }
    } else {
      orderBy[column[0]] = column[1];
    }
  });

  return orderBy;
};
