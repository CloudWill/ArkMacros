var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    steam_name: { type: String, required: true },
    tribe: { type: Schema.ObjectId, ref: 'Tribe', required: true },
    ign: { type: String},
    battlemetrics_id: { type: String },
    notes: { type: String }
});

// Virtual for allies name with notes
PlayerSchema.virtual('name').get(function() {
  return 'steam name:' + this.steam_name + ' | ign: ' + this.ign;
});

// Virtual for this instance URL.
PlayerSchema.virtual('url').get(function() {
  return '/catalog/player/' + this._id;
});

// Export model.
module.exports = mongoose.model('Player', PlayerSchema);

