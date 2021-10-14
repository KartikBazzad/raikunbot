const { PrismaClient } = require('@prisma/client');
const { muted_users, guilds, banned_users, staffMembers } = new PrismaClient();
module.exports = {
  name: 'mute',
  description:
    'Mute a user for Server, this will remove permissions to send message from the user, the user can still view all the channels but wont be able to send messages in the channel, to unmute the user use unmute command',
  summary: 'Mute a user from the server',
  usage: ['[user] [reason]'],
  example: ['mute [user] spamming chat'],
  staffOnly: true,
  guildOnly: true,
  async execute(message, args, cmd, client, Discord) {
    try {
      if (!args.length) return message.reply('Tag the user you want to mute');
      const staff = await staffMembers.findFirst({
        where: {
          discordId: message.author.id,
          guildId: message.guild.id,
        },
      });

      if (!staff) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      const muteTarget = message.mentions.members.first();
      const targetUser = message.guild.members.cache.get(muteTarget.id);
      if (!targetUser) {
        return message.reply('Cant find this user');
      }
      const guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
      const { muteRole, logChannel } = guild;
      if (!muteRole) {
        return message.reply(
          'Mute role not found, please set the mute role using the setmute command',
        );
      }
      const muterole = await message.guild.roles.cache.find(
        (role) => role.id === muteRole,
      );
      if (!muterole)
        return message.reply(
          'Mute role not found, please set the mute role using the setmute command',
        );

      if (!args[1]) {
        args[1] = 'No reason provided';
      } else {
        args[1] = args.slice(1).join(' ');
      }
      const roles = [];
      targetUser.roles.cache.map((role) => {
        roles.push(role.id);
        targetUser.roles.remove(role.id);
      });
      muteTarget.roles.add(muterole);
      const member = await muted_users.create({
        data: {
          discordId: muteTarget.id,
          guildId: message.guild.id,
          roles: `${roles.join(' | ')}`,
          reason: args[1],
        },
      });
      message.reply(`User ${muteTarget} has been muted by ${message.author}`);
      if (logChannel === null) return;
      const embed = new MessageEmbed()
        .setAuthor(
          targetUser.username + '#' + targetUser.discriminator,
          targetUser.displayAvatarURL(),
        )
        .setTitle('Member Muted')
        .setColor('GREY')
        .setFooter(` ${message.guild.name}`, `${message.guild.iconURL()}`)
        .addFields([
          {
            name: '`Muted User:`',
            value: `${targetUser.username + '#' + targetUser.discriminator}`,
          },
          {
            name: '`Muted by:`',
            value: `${message.author}`,
          },
        ])
        .setTimestamp();
      embed.addField('`Reason`:', `${args[1]}`);

      const logchannel = client.channels.cache.get(guild.logChannel);
      logchannel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      message.channel.send('Error Occured');
      return null;
    }
  },
};
