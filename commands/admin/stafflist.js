const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { guilds } = new PrismaClient();
module.exports = {
  name: 'stafflist',
  description: 'Display a list of staff members from a guild',
  aliases: ['sl', 'ls', 'slist'],
  Permissions: ['ADMINISTRATOR'],
  async execute(message, args, cmd, client, Discord) {
    try {
      if (this.permissions) {
        const authorPerms = message.channel.permissionsFor(message.author);
        if (!authorPerms || !authorPerms.has(this.permissions)) {
          return message.reply('Not Allowed');
        }
      }
      const list = await guilds.findUnique({
        where: {
          guildId: message.guild.id,
        },
        include: {
          staffMembers: true,
        },
      });

      const embed = new MessageEmbed()
        .setTitle(`${list.guildName}`)
        .setDescription('List of Staff Members')
        .setColor('AQUA')
        .setThumbnail(message.guild.iconURL({ dynamic: true }));
      if (list.staffMembers.length) {
        list.staffMembers.map((x) => {
          embed.addField(
            `${list.staffMembers.indexOf(x) + 1}`,
            `<@${x.discordId}>`,
          );
        });
      } else {
        embed.addField(
          `${list.staffMembers.length}`,
          'No staff Members Currently',
        );
      }
      message.reply({ embeds: [embed] });
    } catch (error) {}
  },
};
