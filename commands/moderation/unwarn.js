const { PrismaClient } = require('@prisma/client');
const wait = require('util').promisify(setTimeout);
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require('discord.js/src/index.js');
const { staffMembers, warnedUsers } = new PrismaClient();

module.exports = {
  name: 'unwarn',
  aliases: ['clearwarn', 'cw'],
  description: 'Remove warning from the user',
  summary: 'Remove warning from the user',
  usage: ['[user]'],
  example: ['warn [user]'],
  staffOnly: true,
  guildOnly: true,
  async execute(message, args, cmd, client, Discord) {
    try {
      const staffmember = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });
      if (!staffmember || !staffmember.active) {
        const staffUser = message.guild.members.cache.get(message.author.id);
        if (!staffUser.permissions.has(['ADMINISTARTOR']))
          return message.reply('You are not authorized to use this Command');
      }
      if (!args.length) {
        return message.reply('Please tag a user');
      }
      const target = message.mentions.members.first();
      if (target.id === message.author.id) {
        return message.reply(`You can't use the command on yourself`);
      }
      const targetUser = message.guild.members.cache.get(target.id);
      const targetWarnings = await warnedUsers.findMany({
        where: { discordId: target.id, guildId: message.guild.id },
      });

      const embed = new MessageEmbed().setTitle('Remove Warning');

      if (!targetWarnings.length) {
        embed.setDescription('No warnings found for the user');
        return message.reply({ embeds: [embed] });
      }
      embed
        .setDescription(
          `Select the warning you want to remove for the user ${target}`,
        )
        .setAuthor(
          `${targetUser.user.username + targetUser.user.discriminator}`,
          targetUser.user.displayAvatarURL(),
        )
        .setTimestamp();
      let menuOptions = [];
      const Menu = new MessageSelectMenu()
        .setCustomId('warnings')
        .setPlaceholder('Select the warning');
      const btn = new MessageButton()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle('SECONDARY');
      targetWarnings.map((warning) => {
        let option = {
          label: warning.warnid,
          value: `${warning.warnid}`,
          description: `Reason: ${warning.reason}`,
        };
        console.log({ warning });
        menuOptions.push(option);
      });

      const filter = (interaction) =>
        (interaction.isSelectMenu() || interaction.isButton()) &&
        interaction.user.id === message.author.id;

      const collector = message.channel.createMessageComponentCollector({
        filter,
        max: 1,
      });

      Menu.addOptions(menuOptions);
      const row = new MessageActionRow().addComponents(Menu);
      const btnRow = new MessageActionRow().addComponents(btn);
      const reply = await message.reply({
        embeds: [embed],
        components: [row, btnRow],
      });
      collector.on('collect', async (collected) => {
        const customId = collected.customId;
        switch (customId) {
          case 'cancel': {
            collected.reply('Operation Canceled');
            await wait(5000);
            reply.delete();
            break;
          }
          default: {
            const value = collected.values[0];
            const deleteWarning = await warnedUsers.deleteMany({
              where: {
                discordId: target.id,
                guildId: message.guild.id,
                warnid: value,
              },
            });
            collected.reply(`Selected Warning has been removed successully`);
            await wait(3000);
            const deleteReply = await collected.editReply(
              'Deleting the messages now',
            );
            await wait(3000);
            reply.delete();
            deleteReply.delete();
            message.reply(`Warning removed from the user: <@${target.id}>`);
          }
        }
      });
    } catch (error) {
      console.log(error);
      message.reply('Error occurred, Dev team notified');
    }
  },
};
