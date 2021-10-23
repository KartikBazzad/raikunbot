const { PrismaClient } = require('@prisma/client');
const { guilds, users } = new PrismaClient();
const { MessageEmbed } = require('discord.js');
//  Search if user exist else create a new
//  Search if the guild exits if exits update it else create new
module.exports = async (Discord, Client, guild) => {
  const joinLog = await guild.fetchAuditLogs({ limit: 1, type: 'BOT_ADD' });
  const { target, executor } = joinLog.entries.first();
  try {
    const oldUser = await users.findUnique({
      where: {
        discordId: executor.id,
      },
    });
    if (oldUser) {
      const oldguild = await guilds.findUnique({
        where: {
          guildId: guild.id,
        },
      });
      if (oldguild) {
        const updateGuild = await guilds.update({
          where: {
            guildId: guild.id,
          },
          data: {
            guildName: guild.name,
            invitedBy: executor.discordId,
          },
        });
      } else {
        const newguild = await guilds.create({
          data: {
            guildId: guild.id,
            guildName: guild.name,
            invitedBy: executor.id,
          },
        });
      }
    } else {
      const newuser = await users.create({
        data: {
          discordId: executor.id,
          discordTag: `${executor.username}#${executor.discriminator}`,
          avatar: executor.avatar,
          discriminator: `${executor.discriminator}`,
        },
      });
      const oldguild = await guilds.findUnique({
        where: {
          guildId: guild.id,
        },
      });
      if (oldguild) {
        const updateGuild = await guilds.update({
          where: {
            guildId: guild.id,
          },
          data: {
            guildName: guild.name,
            invitedBy: executor.discordId,
          },
        });
      } else {
        const newguild = await guilds.create({
          data: {
            guildId: guild.id,
            guildName: guild.name,
            invitedBy: newuser.discordId,
          },
        });
      }
    }
    const embed = new MessageEmbed()
      .setTitle(`Thank You`)
      .setDescription(
        `Hi this is your personal Moderation Bot. This bot contains a lot of features such as logging events, Kick, Ban, mute etc. Please use tutorial command : **tutorial** to get familiar with the bot`,
      )
      .setFooter(`${Client.user.username}`)
      .setThumbnail(Client.user.displayAvatarURL({ dynamic: true }));
    const channel = await Client.channels.cache.get(guild.systemChannelId);
    channel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
};
