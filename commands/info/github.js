const { bot_info } = require("../../config.json")

module.exports = {
    name: "github",
    category: "info",
    description: "Returns github link",
    run: async(client, message, args) => {
        const msg = await message.channel.send(bot_info.github)
    }
}