const data = require('./phones.json');
const items = data.map((item) => ({
  title: item.name,
  subtitle: `Purchasing date: ${item.purchasingDate}`,
  icon: {
    path: item.cover
  },
  arg: item.name
}));

console.log(JSON.stringify({ items }));
