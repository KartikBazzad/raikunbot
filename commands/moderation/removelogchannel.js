const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'removelogchannel',
  aliases: ['removelogs', 'logremove', 'logdel', 'ld', 'dl'],
  summary: 'Remove Server log Channel',
  description:
    'Remove server log channel from the settings. This will stop logging events into the guild',
  staffOnly: true,
  guildOnly: true,
  usage: [],
  example: ['removelogchannel'],
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
      const Guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
      if (Guild) {
        const updatedGuild = await guilds.update({
          where: { guildId: message.guild.id },
          data: { logChannel: null },
        });
        return message.reply(`Successfully removed the Log Channel`);
      }
    } catch (error) {
      console.log(error);
      return message.reply('error occured, pls try again later');
    }
  },
};
