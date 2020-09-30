module.exports = {
    name: 'no',
    category: 'memes',
    description: 'no',
    run: async(client, message, args) => {
        const msg = await message.channel.send('The answer is no :)')
    }
}