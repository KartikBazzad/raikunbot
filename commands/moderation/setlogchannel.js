const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'logchannelset',
  aliases: ['setlogs', 'logset'],
  summary: 'Set a channel for Server Log',
  description: 'This command let user to set a channel as log channel',
  staffOnly: true,
  guildOnly: true,
  usage: ['[channel]'],
  example: ['Logchannelset #logchannel'],
  async execute(message, args, cmd, client, Discord) {
    try {
      const staffmember = await staffMembers.findFirst({
        where: {
          guildId: message.guild.id,
          discordId: message.author.id,
        },
      });
      if (!staffmember || !staffmember.active) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      if (!args[0]) {
        return message.reply('Please tag the channel or provide channel Id');
      }
      const channelId = args[0].replace(/[#<>]/g, '');
      const Guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
      if (Guild) {
        const updatedGuild = await guilds.update({
          where: { guildId: message.guild.id },
          data: { logChannel: channelId },
        });
        return message.reply(`<#${channelId}> set as Log Channel`);
      }
    } catch (error) {
      message.reply('Error occured, Dev team notified');
      console.log(error);
    }
  },
};
