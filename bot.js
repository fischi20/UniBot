const { Client } = require('discord.js');
const { config } = require('dotenv');

const client = new Client({
    disableEveryone: true
});

config({
    path: __dirname + "/.env"
})

client.on("ready", () => {
    console.log(client.user.username)

    client.user.setPresence({
        status: 'online',
        game: {
            name: "me getting developed",
            type: "WATCHING"
        }
    })
})

client.on('message', async message => {
    const prefix = ">";


    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;


    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    switch (cmd) {
        case "ping":
            {
                // Send a message
                const msg = await message.channel.send(`🏓 Pinging....`);

                // Edit the message
                msg.edit(`🏓 Pong!\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms`);
                break;
            }
        case "calender":
            {
                const msg = await message.channel.send('https://calendar.google.com/calendar/u/0?cid=YzBrM2UyZXNsa2V1M2RoNG1zNDRkbmJsaXNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ');
                break;
            }
        case "help":
            {
                const msg = await message.channel.send('The answer is no :)')
                setTimeout(() => {
                    msg.edit('ping: pings server \n' +
                        'calender: sends a link to the google calender'
                    )
                }, 1500)
                break;
            }
        default:
            {
                const msg = await message.channel.send('send Welp')
            }
    }
})


client.login(process.env.TOKEN);