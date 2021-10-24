const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
  name: 'stats',
  summary: 'Display Bot Info',
  description: 'Display the Bot info',
  aliases: ['bot-info'],
  guildOnly: true,
  usage: [],
  example: ['stats', 'bot-info'],
  description: 'Get the detailed information of bot',
  async execute(message, args, cmd, client, Discord) {
    let embed = new MessageEmbed()
      .setColor('RED')
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor(`STATS AND INFORMATION`, client.user.displayAvatarURL())
      .setDescription(
        `My name is **${client.user.username}** and My work is to Watch your server`,
      )
      .addField('SERVERS', `${client.guilds.cache.size}`, true)
      //   .addField('PRESENCE', client.user.presence.activities[0].name, true)
      .setFooter('ID: ' + client.user.id, message.guild.iconURL())
      .setTimestamp()
      .addField('UPTIME', ms(client.uptime, { long: true }), true)
      //   .addField('STATUS', client.user.presence.status, true)
      .addField('TOTAL MEMBERS', `${client.users.cache.size}`, true);
    message.channel.send({ embeds: [embed] });
  },
};
