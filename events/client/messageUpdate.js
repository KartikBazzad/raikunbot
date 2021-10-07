const { PrismaClient } = require('@prisma/client');
const { MessageEmbed } = require('discord.js');
const { guilds } = new PrismaClient();
module.exports = async (Discord, Client, oldmsg, newmsg) => {
  try {
    if (oldmsg.author.bot) return;
    const guild = await guilds.findUnique({
      where: {
        guildId: oldmsg.guildId,
      },
    });
    if (guild.logChannel === null) return;
    const channel = Client.channels.cache.get(guild.logChannel);
    const embed = new MessageEmbed()
      .setAuthor(
        oldmsg.author.username + '#' + oldmsg.author.discriminator,
        `${oldmsg.author.displayAvatarURL()}`,
      )
      .setDescription(`Message edited in <#${oldmsg.channelId}>`)
      .setColor('BLUE')
      .setFooter(`Msg ID: ${oldmsg.id}`)
      .setTimestamp()
      .addFields([
        { name: '`Old Message:`', value: oldmsg.content },
        { name: '`New Message:`', value: newmsg.content },
        {
          name: '`Sent On:`',
          value: new Date(oldmsg.createdTimestamp).toLocaleString(),
          inline: true,
        },
        {
          name: '`Edited On:`',
          value: `${new Date(newmsg.editedTimestamp).toLocaleString()}`,
          inline: true,
        },
      ]);
    channel.send({ embeds: [embed] });
  } catch (error) {
    console.log(error);
  }
};
