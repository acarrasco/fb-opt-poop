var _ = require('lodash');

// Add quote schema to bot
module.exports = function(bot) {
	var poopSchema = new bot.db.mongoose.Schema({
		_id: bot.db.mongoose.Schema.Types.ObjectId,
		nick: {
			type: String,
			required: true,
			index: true
		},
		count: {
			type: Number,
			required: true,
			index: true,
			default: 0
		}
	});

	poopSchema.statics.top = function(limit, callback) {
		this.find()
			.sort({
				count: -1
			})
			.limit(limit)
			.exec(callback);
	};

	poopSchema.statics.getPoops = function(username, callback) {
		this.findOne({
				nick: new RegExp(username, 'i')
			})
			.exec(callback);
	};

	var poopAttributionSchema = new bot.db.mongoose.Schema({
		_id : {
			pooper: bot.db.mongoose.Schema.Types.ObjectId,
			pooped: bot.db.mongoose.Schema.Types.ObjectId
		},
		count: {
			type: Number,
			required: true,
			index: true,
			default: 0
		}
	});

	bot.db.schemas.pooped = bot.db.mongoose.model('Pooped', poopSchema);
	bot.db.schemas.poopAttribution = bot.db.mongoose.model('PoopAttribution', poopAttributionSchema);
};
