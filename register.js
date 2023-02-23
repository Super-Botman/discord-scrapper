import { REST, Routes, BaseManager } from 'discord.js';
import * as dotenv from 'dotenv'

dotenv.config()

const commands = [
  {
    name: 'scrap',
    description: 'scrap all links of the channel and store it',
    options: [
      {
        type: 5,
        name: 'debug',
        description: 'debug mod'
      }
    ],
    permissions: [
      {
        id: '1038190829979828325',
        type: 1,
        permission: false,
      },
      {
        id: '1074445391728214107',
        type: 1,
        permission: true,
      },
    ]
  }
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();