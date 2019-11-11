module.exports = function changeCase(records, fields = '') {

  if (fields !== '' & Array.isArray(fields)) {
    fields.map(field => {
      records[field] = records[field].toUpperCase();
    });
    return records;
  } else {
    Object.keys(records).map(field => {
      records[field] = records[field].toUpperCase();
    });
    return records;
  }
};