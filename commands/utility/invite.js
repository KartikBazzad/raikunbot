const { MessageActionRow, MessageButton } = require('discord.js/src/index.js');

module.exports = {
  name: 'invite',
  summary: 'Get guild and bot invite links',
  description: 'Provide a link for Server Invite and Bot invite',
  async execute(message, args, cmd, client, Discord) {
    try {
      const btn1 = new MessageButton().setLabel('Join Server').setStyle('LINK');
      const btn2 = new MessageButton()
        .setLabel('Invite Bot')
        .setURL(
          `https://discord.com/api/oauth2/authorize?client_id=` +
            client.application.id +
            `&permissions=8&scope=bot`,
        )
        .setStyle('LINK');

      message.guild.systemChannel
        .createInvite({ unique: true })
        .then((invite) => {
          btn1.setURL(`https://discord.gg/` + invite.code);
          const row = new MessageActionRow().addComponents([btn1, btn2]);
          const filter = (interaction) => interaction.isButton();
          const collector = message.channel.createMessageComponentCollector({
            filter,
          });
          collector.on('collect', async (collected) => {});

          message.reply({
            content: 'Join the Guild or Invite Bot to your server',
            components: [row],
          });
        })
        .catch((err) => message.reply('error occured during invite'));
    } catch (error) {
      message.reply(
        'Error occured while Executing the command. Dev team has been alerted of the issue',
      );
    }
  },
};
