var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ServerclusterSchema = new Schema({
    servercluster_name: {type: String, required: true}
});

// Virtual for this instance URL.
ServerclusterSchema
.virtual('url')
.get(function () {
  return '/catalog/servercluster/'+this._id;
});

// Export model.
module.exports = mongoose.model('Servercluster', ServerclusterSchema);