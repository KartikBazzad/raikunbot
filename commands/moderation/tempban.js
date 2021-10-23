const { PrismaClient } = require('@prisma/client');
const { temp_Banned_users, guilds, staffMembers } = new PrismaClient();
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports = {
  name: 'tempban',
  aliases: ['tban', 'tb'],
  staffOnly: true,
  usage: [],
  guildOnly: true,
  summary: 'Ban members temporarily',
  description: 'Ban members temporarily for a specific time duration',
  example: [
    'tempban @[user] [duration] [reason]',
    'tb @[user] [duration] [reason]',
  ],
  async execute(message, args, cmd, client, discord) {
    try {
      if (!args.length)
        return message.reply('Tag the user you want to ban temprarily');
      if (!args[1]) return message.reply('Provide a time duration');
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });

      if (!staff.active || !staff) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      const target = message.mentions.members.first();
      if (!target) return message.reply('Tag the user you want to ban');

      const targetUser = client.users.cache.get(target.id);
      const targetperms = message.channel.permissionsFor(targetUser);
      if (targetperms.has('ADMINISTRATOR')) {
        return message.reply('Not Allowed');
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
      if (!args[2]) {
        args[2] = `No reason specified`;
      } else {
        args[2] = args.slice(2).join(' ');
      }
      target.ban({ reason: args[2] }).then(async () => {
        const user = await temp_Banned_users.create({
          data: {
            discordId: targetUser.id,
            guildId: message.guild.id,
            duration: args[1],
            bannedBy: message.author.id,
            reason: args[2],
          },
        });
        message.reply(
          `user ${target} has been banned temporarily for ${args[1]} by ${message.author}`,
        );
        const guild = await guilds.findUnique({
          where: { guildId: message.guild.id },
        });
        if (guild.logChannel === null) return;
        const embed = new MessageEmbed()
          .setAuthor(
            targetUser.username + '#' + targetUser.discriminator,
            targetUser.displayAvatarURL(),
          )
          .setTitle('Member Banned')
          .setColor('YELLOW')
          .setFooter(` ${message.guild.name}`, `${message.guild.iconURL()}`)
          .addFields([
            {
              name: '`Banned User:`',
              value: `${targetUser.username + '#' + targetUser.discriminator}`,
            },
            {
              name: '`Banned by:`',
              value: `${message.author}`,
            },
            { name: '`Duration:`', value: args[1] },
          ])
          .setTimestamp();
        embed.addField('`Reason`:', `${args[2]}`);

        const logChannel = client.channels.cache.get(guild.logChannel);
        if (logChannel) {
          logChannel.send({ embeds: [embed] });
        }
        setTimeout(async () => {
          const newembed = new MessageEmbed()
            .setAuthor(
              targetUser.username + '#' + targetUser.discriminator,
              targetUser.displayAvatarURL(),
            )
            .setTitle('Member Unbanned')
            .setColor('YELLOW')
            .setFooter(` ${message.guild.name}`, `${message.guild.iconURL()}`)
            .addFields([
              {
                name: '`Unbanned User:`',
                value: `${
                  targetUser.username + '#' + targetUser.discriminator
                }`,
              },
              {
                name: '`Unbanned by:`',
                value: `${message.author}`,
              },
              { name: '`Duration:`', value: args[1] },
            ])
            .setTimestamp();
          message.guild.members.unban(target.id);
          const unbanned_user = await temp_Banned_users.findFirst({
            where: {
              discordId: target.id,
              guildId: message.guild.id,
              bannedBy: message.author.id,
            },
          });
          if (logChannel) {
            logChannel.send({ embeds: [newembed] });
          }
          return message.channel.send(`user ${targetUser} has been unbanned`);
        }, ms(args[1]));
      });
    } catch (error) {
      console.log(error);
      return message.reply('Error occured, Dev team notified');
    }
  },
};
