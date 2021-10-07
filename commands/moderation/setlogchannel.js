const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'logs-channel-set',
  aliases: ['setlogs', 'logset'],
  description: 'Set a channel for Server Log',

  guildOnly: true,
  usage: 'logset #channel',
  async execute(message, args, cmd, client, Discord) {
    try {
      const staffmember = await staffMembers.findFirst({
        where: {
          guildId: message.guild.id,
          discordId: message.author.id,
        },
      });
      if (!staffmember) {
        return message.reply(`You don't have permissions to do this`);
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
        message.reply(`Successfully set the <#${channelId}> as Log Channel`);
      }
    } catch (error) {
      console.log(error);
      message.reply('error occured, pls try again later');
    }
  },
};
