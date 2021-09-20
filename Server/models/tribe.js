var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var TribeSchema = new Schema({
    tribe_name: { type: String, required: true },
    alignment: { type: [Schema.ObjectId], ref: 'Alignment' },
    servercluster: { type: [Schema.ObjectId], ref: 'Servercluster' },
    server: { type: [Schema.ObjectId], ref: 'Server' }
});

// Virtual
TribeSchema.virtual('name').get(function () {
    return this.tribe_name;
});

// Virtual for this tribe instance URL.
TribeSchema.virtual('url').get(function () {
    return '/catalog/tribe/' + this._id;
});

// Export model.
module.exports = mongoose.model('Tribe', TribeSchema);