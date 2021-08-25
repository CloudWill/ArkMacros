var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EnemySchema = new Schema({
  steam_name: { type: String, required: true},
  ign: { type: String},
  battlemetrics_id: { type: String },
  notes: { type: String }
});

// Virtual for allies name with notes
EnemySchema.virtual('name').get(function() {
  return 'ign: ' + this.ign + ' | Notes: ' + this.notes;
});

// Virtual for this instance URL.
EnemySchema.virtual('url').get(function() {
  return '/catalog/enemy/' + this._id;
});

// Export model.
module.exports = mongoose.model('Enemy', EnemySchema);

