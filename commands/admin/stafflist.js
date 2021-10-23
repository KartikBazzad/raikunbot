const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { guilds } = new PrismaClient();
module.exports = {
  name: 'stafflist',
  guildOnly: true,
  summary: 'Display a list of staff members from a guild',
  description:
    'Display a list of all the staff members from the guild, the command can be used with args to show a list of currently active and demoted staff members and all the users muted/banned by the staff member',
  usage: ['demoted', ''],
  aliases: ['sl', 'ls', 'slist'],
  example: [
    'stafflist',
    'ls',
    'sl',
    'stafflist demoted',
    'sl demoted',
    'ls demoted',
  ],
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

        .setColor('AQUA')
        .setThumbnail(message.guild.iconURL({ dynamic: true }));

      if (list.staffMembers.length) {
        let y = 0;
        if (args[0] === 'demoted') {
          embed.setDescription('List of Demoted Staff Members');
          list.staffMembers

            .filter((x) => !x.active)
            .map((x) => {
              embed.addField(`${++y}`, `<@${x.discordId}>`);
            });
        } else {
          embed.setDescription('List of Active Staff Members');
          list.staffMembers
            .filter((x) => x.active === true)
            .map((x) => {
              embed.addField(`${++y}`, `<@${x.discordId}>`);
            });
        }
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
