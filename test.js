const fs = require('fs');

const x = fs.stat('./index.html', (err, stats) => {
  if (err) {
    console.error(err);
  }
});


console.log(x.stats.size);

