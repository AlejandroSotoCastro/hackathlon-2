const Observer = require('./src/observer');

var obserser = new Obserser();

const rootFolder = './';

obserser.on('dir-updated', log => {
  console.log(log.message);
});

obserser.on("error",log => {
    console.log(log.error);
  });

obserser.watchFile(rootFolder);