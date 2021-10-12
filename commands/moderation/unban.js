const { PrismaClient } = require('@prisma/client');
const wait = require('util').promisify(setTimeout);
const { temp_Banned_users, guilds, banned_users, staffMembers } =
  new PrismaClient();
const {
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
  MessageButton,
} = require('discord.js');
module.exports = {
  name: 'unban',
  aliases: ['ub'],
  guildOnly: true,
  description: 'unban members',
  example: ['.unban <userid>', '.ub <userid>'],
  async execute(message, args, cmd, client, discord) {
    try {
      // if (!args.length)
      //   return message.reply('Provide the id of the user you want to unban');
      const staff = await staffMembers.findFirst({
        where: { discordId: message.author.id, guildId: message.guild.id },
      });

      if (!staff)
        return message.reply('You are not authorized to use this Command');
      const embed = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(
          'The below list contain the list of banned members \n select a user to unban or click on the button to cancel the operation',
        )
        .setTimestamp()
        .setFooter(client.user.username, client.user.displayAvatarURL());
      const banAuditLogs = await message.guild.bans.fetch();
      if (banAuditLogs.size === 0) {
        return message.reply('No member to unban');
      }
      const button = new MessageButton()
        .setCustomId('cancel')
        .setLabel('cancel')
        .setStyle('PRIMARY');
      const menu = new MessageSelectMenu()
        .setCustomId('select')
        .setPlaceholder('Select user to unban');
      const userArray = [];
      banAuditLogs.map((x) => {
        userArray.push({
          value: x.user.id,
          description: `Reason: ${x.reason}`,
          label: x.user.username + x.user.discriminator,
        });
      });
      menu.addOptions(userArray);
      const row = new MessageActionRow().addComponents(menu);
      const row2 = new MessageActionRow().addComponents(button);
      const reply = await message.reply({
        embeds: [embed],
        components: [row, row2],
      });
      const filter = (interaction) =>
        (interaction.isSelectMenu() || interaction.isButton()) &&
        interaction.user.id === message.author.id;
      const collector = message.channel.createMessageComponentCollector({
        filter,
        max: '1',
      });

      collector.on('collect', async (collected) => {
        const { customId } = collected;
        switch (customId) {
          case 'cancel':
            collected.reply('operation canceled');
            reply.delete();
            break;
          default:
            console.log(collected.values[0]);
            message.guild.members.unban(collected.values[0]);
            const delete_user = await banned_users.findFirst({
              where: {
                discordId: collected.values[0],
                guildId: message.guild.id,
              },
            });
            if (delete_user) {
              try {
                await banned_users.delete({ where: { id: delete_user.id } });
              } catch (error) {
                console.log(`Error occured while deleting user from db`);
              }
            }

            collected.reply('User unbanned successfully');

            await wait(5000);
            console.log('deleting Message');
            return reply.delete();
        }
      });

      // const targetUser = client.users.cache.get(args[0]);
      // if (!targetUser) {
      //   return message.reply('Cant find user with this id');
      // }
      // const guild = await guilds.findUnique({
      //   where: { guildId: message.guild.id },
      // });
      // const embed = new MessageEmbed()
      //   .setAuthor(
      //     targetUser.username + '#' + targetUser.discriminator,
      //     targetUser.displayAvatarURL(),
      //   )
      //   .setTitle('Member Unbanned')
      //   .setColor('GREEN')
      //   .setFooter(` ${message.guild.name}`, `${message.guild.iconURL()}`)
      //   .addFields([
      //     {
      //       name: '`Unbanned User:`',
      //       value: `${targetUser.username + '#' + targetUser.discriminator}`,
      //     },
      //     {
      //       name: '`Unbanned by:`',
      //       value: `${message.author}`,
      //     },
      //   ])
      //   .setTimestamp();

      // message.guild.members.unban(args[0]);
      // const banned_user = await banned_users.deleteMany({
      //   where: {
      //     discordId: args[0],
      //     guildId: message.guild.id,
      //   },
      // });
      // if (guild.logChannel === null) return;
      // const logChannel = client.channels.cache.get(guild.logChannel);
      // logChannel.send({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      if (error) {
        message.reply('Could not unban the user due to error');
        return null;
      }
    }
  },
};
