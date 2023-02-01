const lineNotify = require('line-notify-nodejs')('ENR2gVAWs0piqmy4HXdCX0gJRMvtnDt4bQk8x0NR7kf');

lineNotify.notify({
    message: 'send test',
  }).then(() => {
    console.log('send completed!');
  });