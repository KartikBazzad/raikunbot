const { PrismaClient } = require('@prisma/client');
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  MessageCollector,
} = require('discord.js/src/index.js');
const { guilds, staffMembers } = new PrismaClient();
module.exports = {
  name: 'Clear',
  summary: 'Clear a desired amount of messages from the channels',
  description:
    'Clear a desired amount of messages from the channel \n if the message amount to be deleted is not specified then it will clear 100 messages by default',
  staffOnly: true,
  guildOnly: true,
  aliases: ['purge'],
  usage: ['', 20],
  example: ['clear 20', 'clear'],
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
      const btn1 = new MessageButton()
        .setLabel('Delete')
        .setCustomId('delete')
        .setStyle('DANGER');
      const btn2 = new MessageButton()
        .setLabel('Cancel')
        .setCustomId('cancel')
        .setStyle('SECONDARY');
      const embed = new MessageEmbed().setTitle('Delete Messages');
      if (!args[0]) {
        args[0] = 100;
      }
      embed
        .setDescription(
          `Delete ${args[0]} messages from the channel <#${message.channelId}>`,
        )
        .addFields([
          {
            name: 'Cleared By',
            value: message.author.username + '#' + message.author.discriminator,
          },
        ])
        .addField(
          'Note',
          'This action is irreversible. Messages deleted will not be restored',
        )
        .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
        .setColor('RED')
        .setFooter(client.user.username, client.user.displayAvatarURL())
        .setTimestamp();
      const row = new MessageActionRow().addComponents([btn1, btn2]);
      const reply = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      const filter = (interaction) =>
        interaction.isButton() && interaction.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({
        filter,
        max: '1',
      });
      const guild = await guilds.findUnique({
        where: { guildId: message.guild.id },
      });
      const logChannel = client.channels.cache.get(guild.logChannel);
      collector.on('collect', async (collected) => {
        const { customId } = collected;
        switch (customId) {
          case 'delete':
            console.log(args);

            logChannel.send({ embeds: [embed] });
            await message.channel.messages
              .fetch({ limit: args[0] })
              .then((messages) => {
                message.channel.bulkDelete(messages);
                collected.reply('Operation Successfull');
              })
              .catch((err) => console.log(err));
            break;
          case 'cancel':
            reply.delete();
            collected.reply('Operation was canceled');
            break;
        }
      });
    } catch (error) {
      message.reply('Error occured during clearing');
    }
  },
};
