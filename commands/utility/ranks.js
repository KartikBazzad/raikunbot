const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js/src/index.js');
const { guildMemberLevels, guilds } = new PrismaClient();
module.exports = {
  name: 'ramks',
  guildOnly: true,
  summary: 'Display a list of most active members',
  description: 'show a list of most active users on the server.',
  aliases: ['scores', 'leaderboard', 'ranks'],
  usage: [],
  example: ['ranks'],
  async execute(message, args, cmd, client, Discord) {
    try {
      const guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
      if (!guild.levels) {
        return message.reply('XP Level system Disabled by admins');
      }
      const levels = await guildMemberLevels.findMany({
        orderBy: [{ level: 'desc' }, { exp: 'desc' }],
        take: 5,
        where: {
          guildId: message.guild.id,
        },
      });

      const embed = new MessageEmbed()
        .setTitle('Guild Leaderboard')
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setThumbnail(message.guild.iconURL())
        .setTimestamp();

      levels.map((user) => {
        embed.addField(
          `${levels.indexOf(user) + 1}`,
          'User: ' +
            `<@${user.discordId}>\n` +
            'Level: ' +
            '`' +
            user.level +
            '`\n' +
            'XP: ' +
            '`' +
            user.exp +
            '`\n' +
            'Required XP: ' +
            '`' +
            user.requiredXp +
            '`',
          true,
        );
      });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.reply('Error Occured, Dev team notified');
    }
  },
};
