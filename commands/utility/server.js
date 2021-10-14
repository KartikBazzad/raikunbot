const { MessageEmbed } = require('discord.js/src/index.js');
const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'server',
  summary: 'Display Server Info',
  description: 'Display the server info',
  aliases: ['sinfo'],
  async execute(message, args, cmd, client, Discord) {
    try {
      const Guild = await guilds.findUnique({
        where: {
          guildId: message.guild.id,
        },
        include: {
          staffMembers: true,
        },
      });
      const owner = client.users.cache.get(message.guild.ownerId);
      const botCount = message.guild.members.cache.filter(
        (x) => x.user.bot,
      ).size;
      const Textchannels = message.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_TEXT',
      ).size;
      const voice = message.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_VOICE',
      ).size;
      const category = message.guild.channels.cache.filter(
        (c) => c.type === 'GUILD_CATEGORY',
      ).size;
      const embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setColor('RED')
        .addFields([
          {
            name: 'Owner:',
            value: '` ' + owner.username + '#' + owner.discriminator + ' `',
          },
          {
            name: 'Verified',
            value: '` ' + message.guild.verified.toString() + ' `',
          },
          {
            name: 'Server Boosts:',
            value: '` ' + `${message.guild.premiumSubscriptionCount}` + ' `',
            inline: true,
          },
          {
            name: 'Server Level:',
            value: '` ' + `${message.guild.premiumTier}` + ' `',
            inline: true,
          },
          {
            name: 'Verification Level:',
            value: '`' + message.guild.verificationLevel + '`',
          },
          {
            name: 'Members:',
            value:
              'Total: ' +
              '` ' +
              `${message.guild.memberCount}` +
              ' `\n' +
              'Online: ' +
              '` ' +
              `${message.guild.presences.cache.size}` +
              ' `\n' +
              'Bots: ' +
              '` ' +
              `${botCount}` +
              ' `\n' +
              'Staff:' +
              '` ' +
              `${Guild.staffMembers.length}` +
              ' `',
            inline: true,
          },
          {
            name: 'Channels',
            value:
              'Total: ' +
              '` ' +
              `${message.guild.channels.cache.size}` +
              ' `\n' +
              'Categories: ' +
              '` ' +
              `${category}` +
              ' `\n' +
              'Text: ' +
              '` ' +
              `${Textchannels}` +
              ' `\n' +
              'Voice:' +
              '` ' +
              `${voice}` +
              ' `',
            inline: true,
          },
          {
            name: 'Created On :',
            value:
              '` ' +
              new Date(message.guild.createdTimestamp).toLocaleDateString() +
              ' `',
          },
        ])
        .setFooter(` ServerID: ${message.guild.id}`)
        .setThumbnail(message.guild.iconURL())
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  },
};
