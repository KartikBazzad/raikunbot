const { PrismaClient } = require('@prisma/client');
const { staffMembers } = new PrismaClient();
module.exports = {
  name: 'staffremove',
  description: 'Remove an user from Staff Members',
  aliases: ['sremove', 'srmv'],
  Permissions: ['ADMINISTRATOR'],
  async execute(message, args, cmd, client, Discord) {
    try {
      if (this.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(this.permissions)) {
          return message.reply('Not Allowed');
        }
      }
      const mentionedUser = message.mentions.users.first();
      if (!mentionedUser)
        return message.reply('Tag a user to remove from staff');
      const newmember = await staffMembers.findFirst({
        where: {
          guildId: message.guild.id,
          discordId: mentionedUser.id,
        },
      });
      if (!newmember) {
        return message.reply('This user is not a Staff member');
      } else {
        const newStaffMember = await staffMembers.delete({
          where: {
            id: newmember.id,
          },
        });
        return message.reply('User Demoted From Staff Member successfully');
      }
    } catch (error) {
      console.log(error);
      message.reply('Command Execution Failed');
    }
  },
};
