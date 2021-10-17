const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, banned_users, temp_Banned_users, muted_users } =
  new PrismaClient();
const ms = require('ms');
module.exports = async (Discord, Client, member) => {
  try {
    const guild = await guilds.findUnique({
      where: { guildId: member.guild.id },
    });
    const muted = await muted_users.findFirst({
      where: { discordId: member.user.id, guildId: member.guild.id },
    });
    if (muted) {
      const muteRole = member.guild.roles.cache.find(guild.muteRole);
      if (muteRole) {
        member.roles.add(muteRole.id);
      }
      member.guild.channels.cache.map((ch) => {
        ch.permissionOverwrites.edit(user.id, {
          CONNECT: false,
          SEND_MESSAGES: false,
          VIEW_CHANNEL: true,
        });
      });
      if (muted.duration) {
        setTimeout(() => {
          member.guild.channels.cache.map((ch) => {
            ch.permissionOverwrites.edit(user.id, {
              CONNECT: true,
              SEND_MESSAGES: true,
              VIEW_CHANNEL: true,
            });
          });
          member.roles.remove(muteRole.id);
        }, ms(muted.duration));
      }
    }

    const bannedUser = await banned_users.findFirst({
      where: { discordId: member.user.id, guildId: member.guild.id },
    });
    if (bannedUser) {
      const reason = 'Banned previously';
      const bannedBy = await staffMembers.findUnique({
        where: { id: bannedUser.bannedBy },
      });
      const staffUser = client.users.cache.get(bannedBy.discordId);
      member.ban({ reason }).then(() => {
        if (guild.logChannel !== null) {
          const embed = new MessageEmbed()
            .setAuthor(
              member.user.username + member.user.discriminator,
              member.user.displayAvatarURL(),
            )
            .setTitle('Member Banned Again')
            .setDescription(
              'User was banned previously by ' +
                staffUser.username +
                staffUser.discriminator,
            )
            .addField(
              'Banned On',
              '`' + bannedUser.createdAt.toLocaleDateString() + '`',
            );
          const logChannel = member.guild.channels.cache.get(guild.logChannel);
          if (logChannel) {
            logChannel.send({ embeds: [embed] });
          }
        }
      });
      return;
    }
    const tempbanned = await temp_Banned_users.findFirst({
      where: { discordId: member.user.id, guildId: member.guild.id },
    });
    if (tempbanned) {
      const reason = 'The user was Banned temporarily previously';
      const bannedBy = await staffMembers.findUnique({
        where: { id: tempbanned.bannedBy },
      });
      const staffUser = client.users.cache.get(bannedBy.discordId);
      member.ban({ reason: reason }).then(() => {
        if (tempbanned.duration) {
          const embed = new MessageEmbed()
            .setAuthor(
              member.user.username + member.user.discriminator,
              member.user.displayAvatarURL(),
            )
            .setTitle('Member Banned Again')
            .setDescription(
              'User was banned previously by ' +
                staffUser.username +
                staffUser.discriminator,
            )
            .addField('Previous Reason', tempbanned.reason)
            .addField(
              'Banned On',
              '`' + bannedUser.createdAt.toLocaleDateString() + '`',
            );
          if (guild.logChannel !== null) {
            const logChannel = member.guild.channels.cache.get(
              guild.logChannel,
            );
            if (logChannel) {
              logChannel.send({ embeds: [embed] });
            }
          }
          setTimeout(() => {
            member.guild.members.unban(member.id);
          }, ms(tempbanned.duration));
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};
