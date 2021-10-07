const { PrismaClient } = require('@prisma/client');
const { temp_Banned_users, guilds, banned_users, staffMembers } =
  new PrismaClient();
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
  name: 'unban',
  aliases: ['ub'],
  guildOnly: true,
  description: 'unban members',
  example: ['.unban <userid>', '.ub <userid>'],
  async execute(message, args, cmd, client, discord) {
    try {
      if (!args.length)
        return message.reply('Provide the id of the user you want to unban');
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });

      if (!staff)
        return message.reply('You are not authorized to use this Command');
      const targetUser = client.users.cache.get(args[0]);
      if (!targetUser) {
        return message.reply('Cant find user with this id');
      }
      const guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
      if (guild.logChannel === null) return;
      const embed = new MessageEmbed()
        .setAuthor(
          targetUser.username + '#' + targetUser.discriminator,
          targetUser.displayAvatarURL(),
        )
        .setTitle('Member Unbanned')
        .setColor('GREEN')
        .setFooter(` ${message.guild.name}`, `${message.guild.iconURL()}`)
        .addFields([
          {
            name: '`Unbanned User:`',
            value: `${targetUser.username + '#' + targetUser.discriminator}`,
          },
          {
            name: '`Unbanned by:`',
            value: `${message.author}`,
          },
        ])
        .setTimestamp();

      message.guild.members.unban(args[0]);
      const logChannel = client.channels.cache.get(guild.logChannel);
      logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      if (error) {
        message.reply('Could not unban the user due to error', error);
        return null;
      }
    }
  },
};
