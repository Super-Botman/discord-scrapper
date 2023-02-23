import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv'
dotenv.config()
import scrap from './commands/scrap.js'

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'scrap') {
    scrap(interaction)
  }
});

client.login(process.env.TOKEN);