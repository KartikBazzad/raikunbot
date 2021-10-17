const { MessageActionRow, MessageButton } = require('discord.js/src/index.js');

module.exports = {
  name: 'donate',
  aliases: [],
  usage: [],
  guildOnly: true,
  examle: ['donate'],
  summary: 'Get the Pateron link to donate',
  description: 'Provide a link for Donate link for the bot',
  async execute(message, args, cmd, client, Discord) {
    try {
      const btn3 = new MessageButton()
        .setLabel('Donate')
        .setStyle('LINK')
        .setURL('https://www.patreon.com/gamercloud');

      const row = new MessageActionRow().addComponents(btn3);
      message
        .reply({
          content: '**Support us on Patreon:**',
          components: [row],
        })
        .catch((err) => message.reply('error occured during invite'));
    } catch (error) {
      console.log(error);
      message.reply('Error occured. Dev team notified');
    }
  },
};
