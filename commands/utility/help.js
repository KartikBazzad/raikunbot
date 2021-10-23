const prefix = process.env.PREFIX;
const wait = require('util').promisify(setTimeout);
const { MessageEmbed, MessageSelectMenu } = require('discord.js');
const { MessageActionRow } = require('discord.js/src/index.js');

const fs = require('fs');
module.exports = {
  name: 'help',
  aliases: [],
  example: ['help'],
  guildOnly: false,
  usage: [],
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
    const commands = [];
    const menu = new MessageSelectMenu()
      .setCustomId('Commands')
      .setPlaceholder('Select Command');
    const options = [];
    fs.readdirSync('./commands/').forEach((dirs) => {
      let command_files = fs
        .readdirSync(`./commands/${dirs}/`)
        .filter((file) => file.endsWith('.js'));
      for (const file of command_files) {
        const command = require(`../../commands/${dirs}/${file}`);
        if (command.name) {
          commands.push(command);
          const option = {
            value: command.name.toUpperCase(),
            description: command.summary,
            label: command.name,
          };
          options.push(option);
          embed.addField(
            '` ' + command.name.toUpperCase() + ' `',
            `${command.summary}`,
            true,
          );
        }
      }
    });
    try {
      menu.addOptions(options);
      const row = new MessageActionRow().addComponents(menu);
      await client.users.cache.get(message.author.id).send({
        embeds: [embed],
        components: [row],
      });
      const filter = (interaction) =>
        interaction.isSelectMenu() && interaction.user.id === message.author.id;
      const collector = await client.users.cache
        .get(message.author.id)
        .dmChannel.createMessageComponentCollector({
          filter,
        });
      collector.on('collect', async (collected) => {
        const value = collected.values[0];
        const command = commands.filter(
          (cmd) => cmd.name.toUpperCase() === value,
        )[0];
        collected.reply('Fetching Command info...');
        const newembed = new MessageEmbed()
          .setAuthor(client.user.username, client.user.displayAvatarURL())
          .setTitle(command.name.toUpperCase())
          .setDescription(command.description);

        if (command.aliases.length >= 1) {
          newembed.addField('Aliases', command.aliases.join(', '));
        } else {
          newembed.addField('Aliases', 'none');
        }
        if (command.usage.length >= 1) {
          newembed.addField(
            'Usage',
            prefix + command.name + ' ' + command.usage.join(' '),
          );
        } else {
          newembed.addField('Usage', prefix + command.name);
        }
        if (command.example.length >= 1) {
          newembed.addField(
            'Example',
            prefix + command.example.join('\n' + prefix),
          );
        } else {
          newembed.addField('Example', prefix + command.name);
        }

        await wait(1000);
        collected.editReply('Done...');
        await wait(2000);
        collected.editReply({
          embeds: [newembed],
          components: [row],
        });
      });
    } catch (error) {
      console.log(error);
      message.reply({
        content: 'Enable DM to view details of All Commands',
        embeds: [embed],
      });
    }
  },
};
