const {
    MessageEmbed
} = require("discord.js")
const quiz = require("./assets/quiz.json")

module.exports = {
    name: 'hint',
    category: 'code',
    description: 'gives a hint (if there are any) to a challenge',
    usage: "[challenge name]",
    run: async(client, message, args) => {
        var arguments = args.join(' ')
        if (arguments) {
            var hints = []
                //gets the hints of the desired Challange
            for (let product of quiz.code) {
                if (product.name == arguments) {
                    hints = product.hints
                }
            }
            var hint_index = -1
            while (hint_index < 0 || hint_index >= hints.length) {
                hint_index = Math.floor(Math.random() * hints.length)
            }
            var embed = new MessageEmbed()
                .setTitle(JSON.stringify(hints[hint_index]))

            var msg = message.channel.send(embed)
        } else {
            var embed = new MessageEmbed()
                .setTitle('Add the challange name please 🙏')
            var msg = message.channel.send(embed)
        }
    }
}