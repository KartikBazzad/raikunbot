const prefix = process.env.PREFIX;
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
module.exports = {
  name: 'help',
  guildOnly: true,
  summary: 'Show all the commands or details of one command',
  description:
    'Show all the commands of the bot, user can select the command from the select menu to get all details of the command',
  async execute(message, args, cmd, client, Discord) {
    let embed = new MessageEmbed()
      .setAuthor('HELP SECTION', client.user.displayAvatarURL())
      .setThumbnail(client.user.displayAvatarURL())
      .setColor('BLURPLE')
      .setDescription(
        `List of all the commands for **${client.user.username}** Bot`,
      )
      .setURL(
        `https://discord.com/api/oauth2/authorize?client_id=` +
          client.application.id +
          `&permissions=8&scope=bot`,
      );
    fs.readdirSync('./commands/').forEach((dirs) => {
      let command_files = fs
        .readdirSync(`./commands/${dirs}/`)
        .filter((file) => file.endsWith('.js'));

      for (const file of command_files) {
        const command = require(`../../commands/${dirs}/${file}`);
        if (command.name) {
          embed.addField(
            '` ' + command.name + ' `',
            ` \n${command.summary}\n`,
            true,
          );
        }
      }
    });
    message.channel.send({ embeds: [embed] });
  },
};
