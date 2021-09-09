var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AlignmentSchema = new Schema({
    alignment_name: {type: String, required: true}
});

// Virtual for this instance URL.
AlignmentSchema
.virtual('url')
.get(function () {
  return '/catalog/alignment/'+this._id;
});

// Export model.
module.exports = mongoose.model('Alignment', AlignmentSchema);