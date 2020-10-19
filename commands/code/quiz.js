const {
    MessageEmbed
} = require('discord.js')
const quiz = require('./assets/quiz.json')
const fs = require('fs')
const config = require('../../config.json')


//FIX ME quiz choice
module.exports = {
    name: 'challenge',
    aliases: ["quiz"],
    category: 'code',
    description: 'Returns code challanges',
    usage: "[list | list chapter | list language | challenge name  ]",
    run: async(client, message, args) => {
        if (args[0] && args[0].toLowerCase() == 'list') {

            var chapter
            var language
            var name

            const embed = new MessageEmbed()
                .setColor("RANDOM")


            var chapters = [...new Set(quiz.code.map(challange => challange.chapter.toLowerCase()))]
            if (args[1]) {
                var languages = [...new Set(quiz.code.map(challange => challange.language.toLowerCase()))]
                var names = [...new Set(quiz.code.map(challange => challange.name.toLowerCase()))]
                args = args.slice(1).join(" ")
                if (args) {
                    chapter = chapters.indexOf(args.toLowerCase())
                    language = languages.indexOf(args.toLowerCase())
                    name = names.indexOf(args.toLowerCase())
                }
            }


            const challenges = (chapter) => {
                return quiz.code
                    .filter(challange => challange.chapter.toLowerCase() == chapter.toLowerCase())
                    .map(chapter => `> ${chapter.name}`)
                    .join("\n");
            }

            const challengesWithLanguage = (language, chapter) => {
                return quiz.code
                    .filter(challange => challange.language.toLowerCase() == language.toLowerCase() && challange.chapter.toLowerCase() == chapter.toLowerCase())
                    .map(chapter => `> ${chapter.name}`)
                    .join("\n");
            }

            if (!(chapter >= 0 || language >= 0 || name >= 0)) {

                const challengesList = chapters
                    .map(chapter => `**${chapter[0].toUpperCase() + chapter.slice(1)}** \n ${challenges(chapter)}`)
                    .reduce((string, chapter) => string + "\n" + chapter)

                console.log(challengesList)
                const msg = await message.channel.send(embed.setDescription(challengesList))
            } else {
                if (chapter >= 0) {

                    const chapterName = chapters[chapter]
                    const challengesList = chapters
                        .filter(chap => chap.toLowerCase() == chapterName.toLowerCase())
                        .map(chap => `**${chap[0].toUpperCase() + chap.slice(1)}** \n ${challenges(chap)}`)
                        .reduce((string, chapter) => string + "\n" + chapter)

                    const msg = await message.channel.send(embed.setDescription(challengesList))
                } else if (language >= 0) {

                    const languageName = languages[language]
                    const challengesList = chapters
                        .map(chapter => `**${chapter[0].toUpperCase() + chapter.slice(1)}** \n ${challengesWithLanguage(languageName, chapter)}`)
                        .reduce((string, chapter) => string + "\n" + chapter)


                    const msg = await message.channel.send(embed.setDescription(challengesList))
                } else if (name >= 0) {
                    var challenge = quiz.code.find(challange => challange.name.toLowerCase() == names[name].toLowerCase())
                    console.log(challenge)
                    var embedChallange = new MessageEmbed()
                        .setTitle(challenge.name)
                        .setThumbnail(quiz.thumbnails[challenge.language])
                        .setColor('#027AE1')
                        .addField('**> Chapter:**', challenge.chapter)
                        .addField('**> Challenge:**', challenge.challenge)
                    if (!challenge.use_file && challenge.starting_code && fs.existsSync(challenge.starting_code)) {
                        embedChallange.addField('**> Starting code: **', '```' + fs.readFileSync(challenge.starting_code) + '```')
                    }
                    embed.addField('>  Hint command: ', '```' + ' ' + config.prefix + 'hint ' + challenge.name + '```')
                    const msg = await message.channel.send(embedChallange)
                        .then(() => {

                            if (challenge.use_file && challenge.starting_code && fs.existsSync(challenge.starting_code)) {
                                message.channel.send({
                                    files: [{
                                        attachment: challenge.starting_code,
                                    }]
                                })
                            }
                        })
                }
            }
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
            embed.addField('>  Hint command: ', '```' + ' ' + config.prefix + 'hint ' + challenge.name + '```')
            const msg = await message.channel.send(embed)
                .then(() => {

                    if (challenge.use_file && challenge.starting_code && fs.existsSync(challenge.starting_code)) {
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