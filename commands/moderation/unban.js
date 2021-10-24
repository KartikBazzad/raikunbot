const { PrismaClient } = require('@prisma/client');
const wait = require('util').promisify(setTimeout);
const { temp_Banned_users, guilds, banned_users, staffMembers } =
  new PrismaClient();
const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'unban',
  aliases: ['ub'],
  staffOnly: true,
  guildOnly: true,
  summary: 'unban member from the guild',
  description:
    'This command can be used to unban users from the ban list, When command is executed, you will see a list of banned users, select the user you want to unban, if the List of banned users is higher then it will divide the banned user list in groups and display the groups',
  example: ['unban', 'ub'],
  usage: [],
  async execute(message, args, cmd, client, discord) {
    try {
      if (!args.length)
        return message.reply('Provide the id of the user you want to unban');
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });

      if (!staff || !staff.active) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      const targetUser = client.users.cache.get(args[0]);
      if (!targetUser) {
        return message.reply('Cant find user with this id');
      }
      const guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
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
      const bannedUser = await banned_users.findFirst({
        where: { discordId: args[0], guildId: message.guild.id },
      });
      const tempBannedUser = await temp_Banned_users.findFirst({
        where: { discordId: args[0], guildId: message.guild.id },
      });
      if (bannedUser) {
        await banned_users.delete({ where: { id: bannedUser.id } }); // delete user record from Permanently banned users table
      }
      if (tempBannedUser) {
        await temp_Banned_users.delete({ where: { id: tempBannedUser.id } }); // delete user record from temp banned users table
      }

      if (guild.logChannel === null) return;
      const logChannel = client.channels.cache.get(guild.logChannel);
      if (logChannel) {
        return logChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      return message.reply('Message occured, Dev team notified');
    }
  },
};
