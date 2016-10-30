const createTasks = require('abota-build');

createTasks({
  dist: [
    'docs/js/script.js',
    'docs/js/script.js.map',
    'docs/css/style.css'
  ]
});
