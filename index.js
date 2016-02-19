var commands = require('./src/commands');

module.exports = {
	displayname: 'Poop',
	description: 'Counts how many times people say the word "poop".',

	init: require('./src/schema'),

	commands: [{
		name: 'Top poopers',
		description: 'Shows the users that said poop the most times',
		usage: 'poop ranking [limit]',
		trigger: /poop.* (top|rank|best)/i,
		func: commands.topQuery
	}, {
		name: 'How many poops',
		description: 'Shows how many times a particular user said poop',
		usage: 'how many poops <user>',
		trigger: /how many poops/i,
		func: commands.userQuery
	}, {
		name: 'Claim poop',
		description: 'Take ownership of your poo after shaming somebody',
		usage: 'that poop is mine!',
		trigger: /(poop.+mine)|(claim.+poop)/i,
		func: commands.claim
	}],

	listeners: [{
		name: 'Poop Listener',
		description: 'Listens for poop triggers',
		trigger: /^#?p[o0][o0]+/i,
		func: commands.increment_the_excrement
	}]
};
