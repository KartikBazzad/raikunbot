const { PrismaClient } = require('@prisma/client');
const { staffMembers } = new PrismaClient();
module.exports = {
  name: 'staffadd',
  guildOnly: true,
  summary: 'Add a user to Staff Members',
  description:
    'With this command users can add members for staff, and give them access to the bot commands, Only users with ADMINISTRATOR can promote and demote members to staff, Only one user can be promoted with each command usage',
  aliases: ['sadd', 'addstaff', 'astaff'],
  usage: ['user'],
  example: ['staffadd [user]', 'addstaff [user]'],
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
        const updatemember = await staffMembers.update({
          where: { id: newmember.id },
          data: {
            active: true,
          },
        });
        return message.reply('User Promoted Successfully');
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
