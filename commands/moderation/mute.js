const { PrismaClient } = require('@prisma/client');
const { muted_users, guilds, banned_users, staffMembers } = new PrismaClient();
module.exports = {
  name: 'mute',
  description: 'Mute a specific user',
  guildOnly: true,
  async execute(message, args, cmd, client, Discord) {
    try {
      if (!args.length)
            return message.reply('Provide the id of the user you want to unban');
        const muteTarget = message.mentions.members.first();
      const staff = await staffMembers.findFirst({
        where: {
          discordId: message.author.id,
          guildId: message.guild.id,
        },
      });
      if (!staff)
        return message.reply('You are not authorized to use this Command');
      const targetUser = client.users.cache.get(muteTarget.id);
      if (!targetUser) {
        return message.reply('Cant find this user');
      }
        const guild = await guilds.findUnique({ where: { guildId: message.guild.id } })
        const { muteRole, logChannel } = guild;
        if (!muteRole) {
            return message.reply('Mute role not found, please set the mute role using the setmute command or createmute commands');
        }
        const 
    } catch (error) {
      message.channel.send('Error Occured');
    }
  },
};
