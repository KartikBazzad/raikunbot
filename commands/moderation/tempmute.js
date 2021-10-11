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
        args[1] = 'No reason Specified';
      } else {
        args[1] = args.slice(1).join(' ');
      }
      const user = message.guild.members.cache.get(target.id);
      const btn1 = new MessageButton()
        .setCustomId('1hr')
        .setLabel('1Hr')
        .setStyle('PRIMARY');
      const btn2 = new MessageButton()
        .setCustomId('6hr')
        .setLabel('6Hr')
        .setStyle('PRIMARY');
      const btn3 = new MessageButton()
        .setCustomId('12hr')
        .setLabel('12Hr')
        .setStyle('PRIMARY');
      const btn4 = new MessageButton()
        .setCustomId('1d')
        .setLabel('1D')
        .setStyle('PRIMARY');
      const btn5 = new MessageButton()
        .setCustomId('2d')
        .setLabel('2D')
        .setStyle('PRIMARY');
      const btn6 = new MessageButton()
        .setCustomId('3d')
        .setLabel('3D')
        .setStyle('PRIMARY');
      const btn7 = new MessageButton()
        .setCustomId('7d')
        .setLabel('7D')
        .setStyle('PRIMARY');
      const btn8 = new MessageButton()
        .setCustomId('15d')
        .setLabel('15D')
        .setStyle('PRIMARY');
      const btn9 = new MessageButton()
        .setCustomId('10m')
        .setLabel('10m')
        .setStyle('PRIMARY');
      const btn10 = new MessageButton()
        .setCustomId('15min')
        .setLabel('15min')
        .setStyle('PRIMARY');
      const btn11 = new MessageButton()
        .setCustomId('30min')
        .setLabel('30min')
        .setStyle('PRIMARY');
      const btn12 = new MessageButton()
        .setCustomId('45min')
        .setLabel('45min')
        .setStyle('PRIMARY');
      const minRow = new MessageActionRow().addComponents([
        btn9,
        btn10,
        btn11,
        btn12,
      ]);
      const hourRow = new MessageActionRow().addComponents([
        btn1,
        btn2,
        btn3,
        btn4,
      ]);
      const daysRow = new MessageActionRow().addComponents([
        btn5,
        btn6,
        btn7,
        btn8,
      ]);
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
            value: `-${args[1]}`,
          },
        ])
        .setFooter(message.guild.name, message.guild.iconURL())
        .setTimestamp();
      const reply = await message.reply({
        content: 'Click the button to ban the user for specified time',
        embeds: [embed],
        components: [minRow, hourRow, daysRow],
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
            break;
          default:
            embed.addField(`Duration`, `${ms(ms(customId), { long: true })}`);
            const roles = [];
            try {
              user.roles.cache.map((role) => {
                roles.push(role.id);
                user.roles.remove(role.id);
              });
              user.roles.add(muterole);
            } catch (error) {
              console.log(error);
            }
            const member = await muted_users.create({
              data: {
                discordId: target.id,
                guildId: `${guild.guildId}`,
                roles: `${roles.join('|')}`,
                reason: args[1],
                duration: ms(ms(customId), { long: true }),
                mutedBy: staff.id,
              },
            });
            collected.reply(
              'User muted for ' + ms(ms(customId), { long: true }),
            );
            if (!logChannel) {
              return;
            } else {
              const logchannel = client.channels.cache.get(logChannel);
              logchannel.send({ embeds: [embed] });
            }
            setTimeout(() => {
              user.roles.remove(muterole);
              member.roles.split(/|/g).map((x) => {
                const role = message.guild.roles.cache.find(
                  (role) => role.id === x,
                );
                user.roles.add(role);
              });
              message.channel.send(
                `User: ${target} has been unmuted successfully`,
              );
            }, ms(customId));
        }
      });
    } catch (error) {
      console.log(error);
      message.channel.send('Error occured, Dev team has been notified');
    }
  },
};
