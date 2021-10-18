const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, guilds, warnedUsers } = new PrismaClient();
const { nanoid } = require('nanoid');
module.exports = {
  name: 'warn',
  description: '',
  summary: '',
  usage: ['[user] [reason]'],
  example: ['warn [user] bad behaviour'],
  staffOnly: true,
  guildOnly: true,
  async execute(message, args, cmd, client, Discord) {
    try {
      const staffmember = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });
      if (!staffmember || !staffmember.active) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      if (!args.length) {
        return message.reply(
          'Please provide correct arguments: `' +
            `${this.example.toString()}` +
            '`',
        );
      }
      const target = message.mentions.members.first();
      if (!target) {
        return message.reply(
          'Please provide correct arguments: `' +
            `${this.example.toString()}` +
            '`',
        );
      }
      const targetUser = message.guild.members.cache.get(target.id);
      console.log(args);
      const targetWarnCount = await warnedUsers.count({
        where: {
          discordId: target.id,
          guildId: message.guild.id,
        },
      });
      console.log(targetWarnCount);
      const reason = args.slice(1).join(' ');
      const warnid = nanoid(5);
      console.log(reason);
      const embed = new MessageEmbed()
        .setAuthor(
          targetUser.user.username + targetUser.user.discriminator,
          targetUser.user.displayAvatarURL(),
        )
        .setTitle('User Warned')
        .setFooter('ID: ' + warnid)
        .setTimestamp()
        .addFields([
          { name: 'Warned User', value: `<@${target.id}>`, inline: true },
          {
            name: 'Warned By',
            value: `<@${message.author.id}>`,
            inline: true,
          },
          { name: 'Reason', value: reason },
        ]);

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
    }
  },
};
