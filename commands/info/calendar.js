const { calendar } = require("../../config.json")

module.exports = {
    name: "calendar",
    category: "info",
    description: "Returns calendar link",
    run: async(client, message, args) => {
        const msg = await message.channel.send(calendar);
    }
}