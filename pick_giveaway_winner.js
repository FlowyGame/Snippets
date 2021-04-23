// This is an excerpt of the official Flow bot's JS file.
// This method isc alled when the /roll comm and is used by an admin
// to pick the winner of agiveaway.
onRoll: function(message, arguments, argument1, argument2) {
        if (this.isAdmin(message.author.id)) {
            var self = this;

            message.delete().catch(exception => self.log('ERROR: Tried to delete message ' + message.id + ' but failed. Reason: ' + exception.message));

            if (! argument1) {
                return ':no_entry: Missing message ID argument that specifies the message with the reactions';
            }

            message.channel.messages.fetch(argument1).then(function(message) {
                const reactions = message.reactions.cache;
                let reactionTypeCounter = 0, internalTypeCounter = 0;
                let userList = {};
                reactions.forEach(function(reaction) {
                    reactionTypeCounter++;
                    reaction.users.fetch().then(function(users) {
                        internalTypeCounter++;
                        users.forEach(function(user) {
                           if (userList[user.id] === undefined && user.bot === false && user.id !== message.author.id) {
                               userList[user.id] = user;
                           }
                        });
                        if (internalTypeCounter === reactions.size) {
                            let userIds = Object.keys(userList);
                            let userId = self.getRandomArrayItem(userIds);
                            if (userId !== null) {
                                message.reply('**There are ' + userIds.length + ' valid participants. And the winner is**:\n' +
                                    '<@' + userList[userId].id + '> (' + userList[userId].username + '#' + userList[userId].discriminator + ')!!! Congratulations 🥳!');
                            } else {
                                message.reply(':no_entry: None of the participants are valid! The creator of the message and bots cannot participate.');
                            }
                        }
                    });
                });
                if (reactionTypeCounter === 0) {
                    message.reply(':warning: The message does not have any reactions.\n' +
                        'Make sure the given message ID ' + argument1 + ' is correct. Link to the message:\n' +
                        message.url);
                }
                //console.log(message.content)
            }).catch((err) => {
                message.reply(':warning: Could not find the message. Check the message ID again and make sure the message is in the current channel: '
                + message.channel.name);
            });
        }
    },
