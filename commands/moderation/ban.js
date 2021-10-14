const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { staffMembers, guilds, banned_users } = new PrismaClient();
module.exports = {
  name: 'Ban',
  staffOnly: true,
  guildOnly: true,
  summary: 'Ban user from the guild',
  description:
    'Ban a user from the guild, You need to be a staff member or ADMIN perms',
  usage: ['[user]'],
  example: ['ban [user]'],
  async execute(message, args, cmd, client, Discord) {
    try {
      if (!args.length) return message.reply('Tag the user you want to Ban');
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });

      if (!staff) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      const target = message.mentions.members.first();
      const targetUser = client.users.cache.get(target.id);
      const targetperms = message.channel.permissionsFor(targetUser);
      if (targetperms.has('ADMINISTRATOR')) {
        return message.reply('Not Allowed to Ban administrator');
      }
      const targetstaff = await staffMembers.findFirst({
        where: {
          discordId: target.id,
          guildId: message.guild.id,
        },
      });

      if (targetstaff) {
        return message.reply(`Can't Ban a staff member.`);
      }
      if (targetUser.id === client.user.id)
        return message.reply(`Can't Ban myself`);
      if (!args[1]) {
        args[1] = `No reason specified`;
      } else {
        args[1] = args.slice(1).join(' ');
      }

      target.ban(args[1]).then(async () => {
        const user = await banned_users.create({
          data: {
            discordId: targetUser.id,
            guildId: message.guild.id,
            bannedBy: message.author.id,
            reason: args[1],
          },
        });
        embed.addField('`Reason`:', `${args[1]}`);
        message.reply(`user ${target} has been Baned by ${message.author}`);
        const guild = await guilds.findUnique({
          where: { guildId: message.guild.id },
        });
        if (guild.logChannel === null) return;
        const embed = new MessageEmbed()
          .setAuthor(
            targetUser.username + '#' + targetUser.discriminator,
            targetUser.displayAvatarURL(),
          )
          .setTitle('Member Baned')
          .setColor('YELLOW')
          .setFooter(` ${message.guild.name}`, `${message.guild.iconURL()}`)
          .addFields([
            {
              name: '`Baned User:`',
              value: `${targetUser.username + '#' + targetUser.discriminator}`,
            },
            {
              name: '`Baned by:`',
              value: `${message.author}`,
            },
          ])
          .setTimestamp();

        const logChannel = client.channels.cache.get(guild.logChannel);
        return logChannel.send({ embeds: [embed] });
      });
    } catch (error) {
      console.log(error);
      message.reply('Could not Ban the user');
    }
  },
};
