module.exports = {
  name: 'listban',
  aliases: ['lb', 'banlist'],
  example: ['listban'],
  usage: [],
  guildOnly: true,
  staffOnly: true,
  summary: `Display a list of users banned on the server`,
  description: 'Display a list of users banned on the server',
  execute(message, args, cmd, client, Discord) {
    message.reply('Under construction');
  },
};
