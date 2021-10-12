const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} = require('discord.js/src/index.js');
const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers, muted_users } = new PrismaClient();
const ms = require('ms');
module.exports = {
  name: 'tempmute',
  description: 'Mute a user for a specified time',
  async execute(message, args, cmd, client, Discord) {
    try {
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });
      if (!staff)
        return message.reply('You are not authorized to use this Command');
      const target = message.mentions.members.first();
      if (!target) return message.reply('Tag the user you want to mute');

      if (!args[1]) {
        return message.reply('Please specify the time');
      }
      const targetIsStaff = await staffMembers.findFirst({
        where: {
          discordId: target.id,
          guildId: message.guild.id,
        },
      });
      if (targetIsStaff) {
        return message.reply('Tagged user can not be muted');
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
      const muterole = await message.guild.roles.fetch(muteRole);
      console.log(muterole);
      if (!muterole)
        return message.reply(
          'Mute role not found, please set the mute role using the setmute command',
        );
      if (!args[2]) {
        args[2] = 'Reason not Specified';
      } else {
        args[2] = args.slice(2).join(' ');
      }
      const user = await message.guild.members.cache.get(target.id);
      const muteBtn = new MessageButton()
        .setCustomId('mute')
        .setLabel('Mute')
        .setStyle('PRIMARY');
      const cancelBtn = new MessageButton()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle('SECONDARY');
      const minRow = new MessageActionRow().addComponents([muteBtn, cancelBtn]);

      const embed = new MessageEmbed()
        .setTitle('Mute Member')
        .setAuthor(
          user.user.username + '#' + user.user.discriminator,
          user.user.displayAvatarURL(),
        )
        .setColor('BLUE')
        .addFields([
          {
            name: 'Muted By',
            value: `<@${message.author.id}>`,
          },
          {
            name: 'Reason: ',
            value: `-${args[2]}`,
          },
        ])
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();
      const reply = await message.reply({
        content: 'Click the button to ban the user for specified time',
        embeds: [embed],
        components: [minRow],
      });

      const filter = (interaction) =>
        interaction.isButton() && interaction.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({
        filter,
        max: '1',
      });
      collector.on('collect', async (collected) => {
        const { customId } = collected;
        switch (customId) {
          case 'cancel':
            collected.reply('Operation Canceled');
            reply.delete;
            break;
          default:
            embed.addField(`Duration`, `${ms(ms(args[1]), { long: true })}`);
            const roles = [];
            try {
              user.roles.cache.map((role) => {
                if (role.name === '@everyone') return;
                roles.push(role.id);
                user.roles.remove(role.id);
              });
              user.roles.add(muteRole);
              message.guild.channels.cache.map((ch) => {
                ch.permissionOverwrites.edit(user.id, {
                  CONNECT: false,
                  SEND_MESSAGES: false,
                  VIEW_CHANNEL: true,
                });
              });
            } catch (error) {
              console.log(error);
            }
            const member = await muted_users.create({
              data: {
                discordId: target.id,
                guildId: `${guild.guildId}`,
                roles: `${roles.join('|')}`,
                reason: args[2],
                duration: ms(ms(args[1]), { long: true }),
                mutedBy: staff.id,
              },
            });
            collected.reply(
              'User muted for ' + ms(ms(args[1]), { long: true }),
            );

            if (!logChannel) {
              return;
            } else {
              const logchannel = client.channels.cache.get(logChannel);
              logchannel.send({ embeds: [embed] });
            }
            setTimeout(() => {
              reply.delete();
            }, 3000);
            setTimeout(async () => {
              user.roles.remove(muteRole);
              console.log(member.roles);
              message.guild.channels.cache.map((ch) => {
                ch.permissionOverwrites.edit(user.id, {
                  CONNECT: true,
                  SEND_MESSAGES: true,
                  VIEW_CHANNEL: true,
                });
              });
              if (member.roles.length >= 1) {
                member.roles.split('|').map((x) => {
                  console.log(x);
                  user.roles.add(x);
                });
              }
              const deleteUserFromDB = await muted_users.delete({
                where: {
                  id: member.id,
                },
              });
              console.log(`member deleted from db and has been unmuted`);
              message.channel.send(
                `User: ${target} has been unmuted successfully`,
              );
            }, ms(args[1]));
        }
      });
    } catch (error) {
      console.log(error);
      message.channel.send('Error occured, Dev team has been notified');
    }
  },
};
