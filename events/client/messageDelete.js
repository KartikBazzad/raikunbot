const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { guilds } = new PrismaClient();
module.exports = async (Discord, Client, message) => {
  try {
    if (message.author.bot) return;
    const guild = await guilds.findUnique({
      where: {
        guildId: message.guild.id,
      },
    });
    if (!guild) return;
    if (guild.logChannel === null) return;
    const logchannel = Client.channels.cache.get(guild.logChannel);
    const embed = new MessageEmbed()
      .setAuthor('Message Deleted', `${Client.user.displayAvatarURL()}`)
      .setColor('RED')
      .addFields([
        {
          name: '`Message Time:`',
          value: `${new Date(message.createdTimestamp).toISOString()}`,
        },
        { name: '`Deleted Message:`', value: message.content },
        { name: '`Message Channel:`', value: `<#${message.channelId}>` },
      ])
      .setFooter(` ${message.guild.name}`, `${message.guild.iconURL()}`)
      .setTimestamp();
    logchannel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
};
