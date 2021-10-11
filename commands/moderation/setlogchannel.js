const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require('discord.js/src/index.js');
const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'logs-channel-set',
  aliases: ['setlogs', 'logset'],
  description: 'Set a channel for Server Log',
  guildOnly: true,
  usage: 'logset #channel',
  async execute(message, args, cmd, client, Discord) {
    try {
      const staffmember = await staffMembers.findFirst({
        where: {
          guildId: message.guild.id,
          discordId: message.author.id,
        },
      });
      if (!staffmember) {
        return message.reply(`You don't have permissions to do this`);
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
