const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require('discord.js/src/index.js');
const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'Logchannelset',
  aliases: ['setlogs', 'logset'],
  summary: 'Set a channel for Server Log',
  description:
    'This command let user to select a channel from the channel list to set channel for logging events such as Kick, Ban, Message Update, Mute etc..',
  staffOnly: true,
  guildOnly: true,
  usage: [''],
  example: ['Logchannelset'],
  async execute(message, args, cmd, client, Discord) {
    try {
      const staffmember = await staffMembers.findFirst({
        where: {
          guildId: message.guild.id,
          discordId: message.author.id,
        },
      });
      if (!staff) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      const embed = new MessageEmbed().setTitle('Set Log Channel');
      const menu = new MessageSelectMenu()
        .setCustomId('select')
        .setPlaceholder('Select Log Channel');
      const menuoptions = [];
      const channels = message.guild.channels.cache;
      console.log(channels);
      channels
        .filter((ch) => ch.type === 'GUILD_TEXT')
        .map((ch) => {
          const option = {
            value: ch.id,
            label: ch.name,
          };
          menuoptions.push(option);
        });
      menu.addOptions(menuoptions);
      const row = new MessageActionRow().addComponents(menu);

      const filter = (interaction) =>
        interaction.isSelectMenu() && interaction.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({
        filter,
        max: '1',
      });
      collector.on('collect', async (collected) => {
        const value = collected.values[0];
        const guildupdate = await guilds.update({
          where: { guildId: message.guild.id },
          data: {
            logChannel: value,
          },
        });
        collected.reply(`<#${value}> has been selected as Log Channel`);
      });
      message.reply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.log(error);
      message.reply('error occured, pls try again later');
    }
  },
};
