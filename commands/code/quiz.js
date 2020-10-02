const {
    MessageEmbed
} = require('discord.js')
const quiz = require('./assets/quiz.json')
const fs = require('fs')
const config = require('../../config.json')

module.exports = {
    name: 'quiz',
    aliases: ["challenge"],
    category: 'code',
    description: 'Returns code challanges',
    usage: "[list]", //TODO challenge name | chapter | programming language
    run: async(client, message, args) => {
        if (args[0] && args[0].toLowerCase() == 'list') {
            const embed = new MessageEmbed()
                .setColor("RANDOM")

            var chapters = quiz.code.map(challange => challange.chapter)

            const challenges = (chapter) => {
                return quiz.code
                    .filter(challange => challange.chapter == chapter)
                    .map(chapter => `> ${chapter.name}`)
                    .join("\n");
            }

            const challengesList = chapters
                .map(chapter => `**${chapter[0].toUpperCase() + chapter.slice(1)}** \n ${challenges(chapter)}`)
                .reduce((string, chapter) => string + "\n" + chapter)

            const msg = await message.channel.send(embed.setDescription(challengesList))
        } else {
            //gets a random quiz
            const challenges = quiz.code
            var challenge_index = -1
                //get a random challannge
            while (challenge_index < 0 || challenge_index >= challenges.length) {
                challenge_index = Math.floor(Math.random() * challenges.length)
            }
            const challenge = challenges[challenge_index]

            var embed = new MessageEmbed()
                .setTitle(challenge.name)
                .setThumbnail(quiz.thumbnails[challenge.language])
                .setColor('#027AE1')
                .addField('**> Chapter:**', challenge.chapter)
                .addField('**> Challenge:**', challenge.challenge)
            if (!challenge.use_file && challenge.starting_code && fs.existsSync(challenge.starting_code)) {
                embed.addField('**> Starting code: **', '```' + fs.readFileSync(challenge.starting_code) + '```')
            }
            embed.addField('>  Hintt command: ', '```' + ' ' + config.prefix + 'hint ' + challenge.name + '```')
            const msg = await message.channel.send(embed)
                .then(() => {

                    if (challenge.use_file && challenge.starting_code && fs.existsSync(challenge.starting_code)) {
                        console.log("here")
                        message.channel.send({
                            files: [{
                                attachment: challenge.starting_code,
                            }]
                        })
                    }
                })
        }
    }
}

/**
 * Basic Challange Layout
 * {
 * "name": "Challange Name",                                // Identify the task
 * "language": "Programming Language",                      // used if there are different programming languages and to display the thumbnail
 * "chapter": "Chapter Name",                               // used to sort the challanges
 * "challenge": "Challange Task",                           // description/task to do/desired result
 * "hints": ["hint1", "hint2", hint3],                      // are displayed randomly for now
 * "starting_code": "Path to code file from project root",  // if somebody doesn't need to start from scratch
 * "use_file": false                                        // if the starting code should be givven by file or by codeblock in the embeded message
 * }
 */