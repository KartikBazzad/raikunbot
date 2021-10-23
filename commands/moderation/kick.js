const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, guilds } = new PrismaClient();
module.exports = {
  name: 'kick',
  staffOnly: true,
  guildOnly: true,
  summary: 'Kick user from the guild',
  description:
    'Kick a user from the guild, You need to be a staff member or ADMIN perms',
  usage: ['[user]'],
  example: ['kick [user]'],
  async execute(message, args, cmd, client, Discord) {
    try {
      if (!args.length) return message.reply('Tag the user you want to kick');
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });

      if (!staff || staff.active) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      const target = message.mentions.members.first();
      const targetUser = client.users.cache.get(target.id);
      const targetperms = message.channel.permissionsFor(targetUser);
      if (targetperms.has('ADMINISTRATOR')) {
        return message.reply('Not Allowed to kick administrator');
      }
      const targetstaff = await staffMembers.findFirst({
        where: {
          discordId: target.id,
          guildId: message.guild.id,
        },
      });

      if (targetstaff) {
        return message.reply(`Can't kick a staff member.`);
      }
      if (targetUser.id === client.user.id)
        return message.reply(`Can't kick myself`);
      if (!args[1]) {
        args[1] = `No reason specified`;
      } else {
        args[1] = args.slice(1).join(' ');
      }

      await target.kick(args[1]).catch((err) => {
        message.reply('Error occured');
      });
      message.reply(`user ${target} has been kicked by ${message.author}`);
      const guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
      if (guild.logChannel === null) return;
      const embed = new MessageEmbed()
        .setAuthor(
          targetUser.username + '#' + targetUser.discriminator,
          targetUser.displayAvatarURL(),
        )
        .setTitle('Member Kicked')
        .setColor('YELLOW')
        .setFooter(` ${message.guild.name}`, `${message.guild.iconURL()}`)
        .addFields([
          {
            name: '`Kicked User:`',
            value: `${targetUser.username + '#' + targetUser.discriminator}`,
          },
          {
            name: '`Kicked by:`',
            value: `${message.author}`,
          },
        ])
        .setTimestamp();
      embed.addField('`Reason`:', `${args[1]}`);

      const logChannel = client.channels.cache.get(guild.logChannel);
      logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.reply('Could not kick the user');
    }
  },
};
