const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, guilds } = new PrismaClient();
module.exports = async (Discord, Client, member) => {
  try {
    const staffMember = await staffMembers.findFirst({
      where: { discordId: member.user.id, guildId: member.guild.id },
    });
    if (staffMember && staffMember.active) {
      let removeStaff = await staffMembers.update({
        where: { id: staffMember.id },
        data: {
          active: false,
        },
      });
      const embed = new MessageEmbed()
        .setAuthor(
          member.user.username + member.user.discriminator,
          member.user.displayAvatarURL(),
        )
        .setTitle('Staff Member Kicked')
        .setTimestamp();
      const fetchKickLogs = await member.guild.fetchAuditLogs({
        type: 'MEMBER_KICK',
        limit: 10,
      });
      const user = fetchKickLogs.entries
        .filter((x) => x.target.id === member.user.id)
        .first();
      if (user) {
        embed.addField(
          'Kicked By',
          user.executor.username + user.executor.discriminator,
        );
        if (user.reason) {
          embed.addField('Reason', user.reason);
        }

        const guild = await guilds.findUnique({
          where: { guildId: member.guild.id },
        });
        if (guild && guild.logChannel !== null) {
          const logChannel = member.guild.channels.cache.get(guild.logChannel);
          return logChannel.send({ embeds: [embed] });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
