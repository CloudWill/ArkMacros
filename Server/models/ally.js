var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AllySchema = new Schema({
  steam_name: { type: String, required: true},
  ign: { type: String},
  battlemetrics_id: { type: String },
  notes: { type: String }
});

// Virtual for allies name with notes
AllySchema.virtual('name').get(function() {
  return 'steam name:' + this.steam_name + ' | ign: ' + this.ign + ' | Notes: ' + this.notes;
});

// Virtual for this instance URL.
AllySchema.virtual('url').get(function() {
  return '/catalog/ally/' + this._id;
});

// Export model.
module.exports = mongoose.model('Ally', AllySchema);

