const { MessageActionRow, MessageButton } = require('discord.js/src/index.js');

module.exports = {
  name: 'invite',
  aliases: ['inv', 'botinv'],
  usage: [],
  examle: ['invite'],
  summary: 'Get guild and bot invite links',
  description: 'Provide a link for Server Invite and Bot invite',
  async execute(message, args, cmd, client, Discord) {
    const btn1 = new MessageButton().setLabel('Join Server').setStyle('LINK');
    const btn3 = new MessageButton()
      .setLabel('Donate')
      .setStyle('LINK')
      .setURL('https://www.patreon.com/gamercloud');
    const btn2 = new MessageButton()
      .setLabel('Invite Bot')
      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=` +
          client.application.id +
          `&permissions=8&scope=bot`,
      )
      .setStyle('LINK');
    btn1.setURL(`https://discord.gg/gPAzUs3NY5`);
    const row = new MessageActionRow().addComponents([btn1, btn2, btn3]);
    try {
      if (message.channel.type === 'DM') {
        return message.reply({
          content: 'Join the Guild or Invite Bot to your server',
          components: [row],
        });
      }
      client.users.cache.get(message.author.id).send({
        content: 'Join the Guild or Invite Bot to your server',
        components: [row],
      });
    } catch (error) {
      message.reply({
        content: 'Join the Guild or Invite Bot to your server',
        components: [row],
      });
    }
  },
};
