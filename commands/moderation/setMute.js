const {
  MessageActionRow,
  MessageSelectMenu,
} = require('discord.js/src/index.js');
const { PrismaClient } = require('@prisma/client');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'Setmute',
  staffOnly: true,
  guildOnly: true,
  aliases: ['smute', 'setmute', 'muteset', 'createmute', 'cmute'],
  summary: 'Set a mute role',
  description:
    'This commands let you select a role which can be given to muted person on the server, the mute role helps in distinguishing muted members from others',
  usage: [''],
  example: ['setmute'],
  async execute(message, args, cmd, client, Discord) {
    try {
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });

      if (!staff) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      const roles = message.guild.roles.cache;

      const menu = new MessageSelectMenu()
        .setCustomId('select')
        .setPlaceholder('Select Mute Role');
      const menuoptions = [];
      roles
        .filter((role) => role.tags === null)
        .map((role) => {
          const option = {
            label: role.name,
            value: role.id,
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
            muteRole: value,
          },
        });
        collected.reply(`The Role <@${value}> has been set as mute role`);
      });
      message.reply({ content: 'Select Channel', components: [row] });
    } catch (error) {
      console.log(error);
    }
  },
};
