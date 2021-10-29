const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'levels',
  staffOnly: true,
  guildOnly: true,
  aliases: ['lvls', 'xp'],
  summary: 'Enable or Disable XP system for a server',
  description: 'Enable or disable XP system for a server',
  usage: ['enable', 'disable'],
  example: ['levels disable', 'levels enable'],
  async execute(message, args, cmd, client, Discord) {
    try {
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });

      if (!staff || !staff.active) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      switch (args[0]) {
        case 'enable': {
          const guild = await guilds.update({
            where: { guildId: message.guild.id },
            data: {
              levels: true,
            },
          });
          message.reply('XP level System Enabled on the Server');
          break;
        }
        case 'disable': {
          const guild = await guilds.update({
            where: { guildId: message.guild.id },
            data: {
              levels: false,
            },
          });
          message.reply('XP level System Disabled on the Server');
          break;
        }
      }
    } catch (error) {
      console.log(error);
      message.channel.send('Error occured, Dev team notified');
    }
  },
};
