const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, warnedUsers } = new PrismaClient();
module.exports = {
  name: 'user',
  aliases: ['user-info'],
  summary: 'Display information for a specified user',
  description:
    'This command displays user information on that server, this includes warnings and join date etc',
  staffOnly: true,
  guildOnly: true,
  async execute(message, args, cmd, client, Discord) {
    try {
      const staffmember = await staffMembers.findFirst({
        where: {
          guildId: message.guild.id,
          discordId: message.author.id,
        },
      });
      if (!staff) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }

      const target = message.mentions.users.first();
      if (!target) return message.reply('Tag a user to get details');
      const user = client.users.cache.get(target.id);
      const u = message.guild.members.cache.get(target.id);
      const staff = await staffMembers.findFirst({
        where: {
          guildId: message.guild.id,
          discordId: target.id,
        },
      });
      const warnings = await warnedUsers.count({
        where: {
          guildId: message.guild.id,
          discordId: target.id,
        },
      });
      const embed = new MessageEmbed()
        .setTitle(target.username)
        .setDescription(`<@${target.id}>`)
        .setAuthor(`Member Details`)
        .setColor('GOLD')
        .setThumbnail(`${user.displayAvatarURL()}`);
      if (staff) {
        embed.addField('Server Permissions', 'Staff');
      } else {
        embed.addField('Server Permissions', 'Member');
      }
      if (!warnings) {
        embed.addField('Server Warnings', `0`);
      } else {
        embed.addField('Server Warnings', `${warnings}`);
      }
      if (u.premiumSinceTimestamp != null) {
        embed.addField(
          'Server Boosting Since',
          `${new Date(u.premiumSinceTimestamp).toLocaleDateString()}`,
        );
      } else {
        embed.addField('Server Boosting Since', `No Booster`);
      }
      embed.addFields([
        {
          name: 'Joined Discord On',
          value: new Date(new Date(user.createdTimestamp)).toLocaleDateString(),
        },
        {
          name: 'Joined Server On',
          value: new Date(u.joinedTimestamp).toLocaleDateString(),
        },
      ]);

      // if(u.premiumSince)
      message.channel.send({ embeds: [embed] });
      // console.log(user);
    } catch (error) {
      console.log(error);
      message.reply('Error while Executing the command');
    }
  },
};