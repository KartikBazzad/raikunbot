const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, guilds, warnedUsers } = new PrismaClient();
const { nanoid } = require('nanoid');
module.exports = {
  name: 'warn',
  aliases: [],
  description: 'Give a warning to the user',
  summary: 'Give a warning to the user',
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

      if (target.id === staffmember.discordId && staffmember.active) {
        return message.reply(
          `Tagged user is an active Staff Member. If there is a problem please contact admins for further to resolve the issue`,
        );
      }
      const targetUser = message.guild.members.cache.get(target.id);
      const targetWarnCount = await warnedUsers.count({
        where: {
          discordId: target.id,
          guildId: message.guild.id,
        },
      });
      const reason = args.slice(1).join(' ');
      const warnid = nanoid(7).toLowerCase();
      console.log(reason);
      const embed = new MessageEmbed()
        .setAuthor('Warn-id: ' + warnid)
        .setTitle('Warning')
        .setColor('ORANGE')
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp()
        .setDescription(`Reason: ${reason}`)
        .addFields([
          { name: 'Warned User', value: `<@${target.id}>`, inline: true },
          {
            name: 'Warned By',
            value: `<@${message.author.id}>`,
            inline: true,
          },
        ])
        .addField(
          '**Note**',
          'Max no. of warnings for a user is 5, if limit reached user will be kicked from the server',
        );

      const warnedUser = await warnedUsers.create({
        data: {
          discordId: target.id,
          guildId: message.guild.id,
          warnid: warnid,
          warningby: staffmember.id,
          reason: reason,
        },
      });
      message.reply({ embeds: [embed] });
      const guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
      if (guild && guild.logChannel !== null) {
        const logChannel = message.guild.channels.cache.get(guild.logChannel);
        if (logChannel) {
          logChannel.send({ embeds: [embed] });
        }
      }

      const warncount = await warnedUsers.count({
        where: { discordId: target.id, guildId: message.guild.id },
      });
      if (warncount === 5) {
        const warnembed = new MessageEmbed()
          .setTitle('Warned User Kicked')
          .setAuthor(
            target.username + target.discriminator,
            targetUser.user.displayAvatarURL(),
          )
          .setTimestamp()
          .setFooter(message.guild.name, message.guild.iconURL())
          .setDescription('User has reached a max no. of warnings');
        await target.kick({ reason: 'Max no. of warning reached for user' });
        if (guild && guild.logChannel !== null) {
          const logChannel = message.guild.channels.cache.get(guild.logChannel);
          if (logChannel) {
            logChannel.send({ embeds: [warnembed] });
          }
        }
      }
      console.log(warncount);
    } catch (error) {
      console.log(error);
    }
  },
};
