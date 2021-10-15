const { MessageEmbed } = require('discord.js/src/index.js');

module.exports = {
  name: 'tutorial',
  usage: [],
  aliases: ['tut'],
  example: [],
  guildOnly: true,
  summary: 'Give a short tutorial for first time usage',
  description: 'Give a short tutorial for first time usage',
  async execute(message, args, cmd, client, Discord) {
    try {
      const embed = new MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setTitle('Tutorial for Raikun')
        .setDescription(
          `This tutorial helps new user to setup ${client.user.username} for a guild for first time`,
        )
        .addFields([
          {
            name: '**Things to do**',
            value: `the list of things required after you add the bot to your server
                  \n 1. Create a new role named mute and use **setmute** command to setup the mute role.
                  \n 2. create a channel for logging events and set permissions according to the need, then use **setlogchannel** command to set the log channel for logging \n
          `,
          },
          {
            name: 'Staff Member',
            value:
              'Staff members are the team of user selected by the Admins, Staffmembers can use the moderation commands, Admins can Promote and Demote staff Members ',
          },
        ])
        .setColor('GREEN')
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.reply('Error occured, Dev team notified');
    }
  },
};
