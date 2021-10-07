const { PrismaClient } = require('@prisma/client');
const { staffMembers } = new PrismaClient();
module.exports = {
  name: 'staffadd',
  description: 'Add a user to Staff Members',
  aliases: ['sadd'],
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
      const newmember = await staffMembers.findFirst({
        where: {
          guildId: message.guild.id,
          discordId: mentionedUser.id,
        },
      });
      if (newmember) {
        return message.reply('This user is already a Staff member');
      } else {
        const newStaffMember = await staffMembers.create({
          data: {
            discordId: mentionedUser.id,
            guildId: message.guild.id,
            promotedBy: message.author.id,
          },
        });
        return message.reply('User promoted to Staff Member successfully');
      }
    } catch (error) {
      console.log(error);
      message.reply('Command Execution Failed');
    }
  },
};
