const bull = require('bull');

const queue = new bull(`tempban`, 'redis://0.0.0.0:6379');

function tempban(message, guild, user, time) {
  console.log(time);
}
module.exports = { queue, tempban };
