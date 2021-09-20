var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DiscordsettingsSchema = new Schema({
    last_active: {type: Date, required: true}
});


// Export model.
module.exports = mongoose.model('Discordsettings', DiscordsettingsSchema);