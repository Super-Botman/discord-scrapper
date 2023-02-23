import { writeFile } from "fs"

export default async (interaction) => {
    const options = { limit: 100 };

    await interaction.channel.messages.fetch(options)
        .then(async messages => {
            if (messages.size === 100) {
                options.before = messages.last().id;
                let a = true
                do{
                    await interaction.channel.messages.fetch(options)
                    .then(moreMessages => {
                        if (moreMessages.size === 100) {
                            options.before = moreMessages.last().id;
                            messages = messages.concat(moreMessages)
                            a = true
                        } else {
                            messages = messages.concat(moreMessages)
                            a = false
                        }
                    })
                }while(a)
            }

            let discord_return = ''
            let to_write_json = []

            let finaMessages = messages.filter(m => m.author.id != "1071004360324173825" && 
                            m.content.includes('http') &&
                            !m.content.includes('tenor.com')
            ).each(async m => {
                let date = new Date(m.createdTimestamp)
                const match = m.content.match(/\b((https?):\/\/|(www)\.)[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/ig)
                discord_return += 
`
\`\`\`message
Link: ${match.join(',')}
Message: ${m.content}
Link_Message: https://discord.com/channels/${m.guildId}/${m.channelId}/${m.id}
Author: ${m.author.username}
Date: ${date.toLocaleString()}
Topic: 
\`\`\`
`                
                let json_obj = {
                    link: match,
                    message: m.content,
                    link_message: `https://discord.com/channels/${m.guildId}/${m.channelId}/${m.id}`,
                    author: m.author.username,
                    date: date.toLocaleString(),
                    topic: []
                }
                to_write_json.push(json_obj)
            })
            
            writeFile('result/messages.json', JSON.stringify(to_write_json), { flag: 'w+' }, (err)=>{
                if(err) {
                    return console.log(err);
                }
                interaction.reply(interaction.options.getBoolean('debug') ? finaMessages.size + ' saved\nwrited:\n' + discord_return : finaMessages.size + ' saved');
            })
        })
        
}