const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { guilds } = new PrismaClient();
module.exports = async (Discord, Client, message) => {
  try {
    if (message.author.bot) return;
    console.log(message);
    const guild = await guilds.findUnique({
      where: {
        guildId: message.guild.id,
      },
    });
    if (!guild) return;
    if (guild.logChannel === null) return;
    const logchannel = Client.channels.cache.get(guild.logChannel);
    const embed = new MessageEmbed()
      .setTitle('Message Deleted')
      .setAuthor(
        `${message.author.username + message.author.discriminator}`,
        `${message.author.displayAvatarURL()}`,
      )
      .setColor('RED')
      .setDescription(
        `Author Id: ${message.author.id} \n Message Id: ${message.id}`,
      )
      .addFields([
        {
          name: '`Message Time:`',
          value: `${new Date(message.createdTimestamp).toISOString()}`,
        },
        { name: '`Deleted Message:`', value: message.content },
        { name: '`Message Channel:`', value: `<#${message.channelId}>` },
      ])
      .setFooter(
        `Author Id: ${message.author.id}`,
        `${message.guild.iconURL()}`,
      )
      .setTimestamp();
    logchannel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
};
