var _ = require('lodash');

var standing = undefined;

module.exports = {
	increment_the_excrement: function(route, args) {
		var user_id = route.user.id;
		var nick = route.nick;

		this.db.schemas.pooped.findOneAndUpdate({
			'_id': user_id
		}, {
			'$set': {
				'nick': nick
			},
			'$inc': {
				'count': 1
			}
		}, {
			'upsert': true,
			'new': true
		}, function(err, data) {
			console.log('poop increment', err, data);
			if (err) {
				route.send('?poop_error', err);
			} else {
				standing = {
					user_id: user_id,
					nick: nick,
					when: new Date().getTime()
				};
				route.send('?poop_update', data.count);
			}
		});
	},
	topQuery: function(route, args) {
		var limit = Number(args.shift()) || 10;
		this.db.schemas.pooped.top(limit, function(err, data) {
			console.log('top poopers', err, data);
			if (err) {
				route.send('?poop_error', err)
				return;
			}
			route.send('?poop_top_header');
			var indirect = route.indirect();
			for (var i = 0; i < data.length; i++) {
				indirect.send('?poop_rank', i + 1, data[i].nick, data[i].count);
			}
		});
	},
	userQuery: function(route, args) {
		var user = args.shift();
		if (!user) {
			route.send('?poop_missing_user');
			return;
		}
		this.db.schemas.pooped.getPoops(user, function(err, data) {
			console.log('poop query', err, data);
			if (err) {
				route.send('?poop_error', err)
			}
			if (!data) {
				route.send('?poop_user_query_missing');
				return
			}
			route.send('?poop_user_query', data.nick, data.count);
		});
	},
	claim: function(route, args) {
		var pooper_id = route.user.id;
		var pooper_nick = route.nick;

		var now = new Date().getTime();
		if (!standing || now - standing.when > 300000) {
			route.send('?poop_nothing_to_claim');
			return;
		}
		var pooped_id = standing.user_id;
		var pooped_nick = standing.nick;

		standing = undefined;
		this.db.schemas.poopAttribution.findOneAndUpdate({
			'_id': {
				pooper: pooper_id,
				pooped: pooped_id
			}
		}, {
			'$inc': {
				'count': 1
			}
		}, {
			'upsert': true,
			'new': true
		}, function(err, data) {
			console.log('poop increment', err, data);
			if (err) {
				route.send('?poop_error', err);
			} else {
				route.send('?poop_claim_update', pooped_nick, data.count);
			}
		});
	}
};
