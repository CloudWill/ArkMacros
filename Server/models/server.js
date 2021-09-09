var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ServerSchema = new Schema({
    server_name: { type: String, required: true },
    server_id: { type: String, required: true },
    servercluster: { type: [Schema.ObjectId], ref: 'Servercluster' }
});

// Virtual for allies name with notes
ServerSchema.virtual('name').get(function() {
    return this.server_name;
});

// Virtual for this instance URL.
ServerSchema.virtual('url').get(function() {
  return '/catalog/server/' + this._id;
});

// Export model.
module.exports = mongoose.model('Server', ServerSchema);

