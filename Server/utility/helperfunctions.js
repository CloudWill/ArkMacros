
//update an existing object and see what the initial attributes are
exports.mark_as_checked = function (attributes, attribute) {
    for (var all_iter = 0; all_iter < attributes.length; all_iter++) {
        for (var one_iter = 0; one_iter < attribute.length; one_iter++) {
            if (attributes[all_iter]._id.toString() === attribute[one_iter]._id.toString()) {
                attributes[all_iter].checked = 'true';
            }
        }
    }
    return attributes;
};

//if there's an error during the initial creation of an objects
exports.error_mark_as_checked = function (attributes, attribute) {
    for (let i = 0; i < attributes.length; i++) {
        if (attribute.indexOf(attributes[i]._id) > -1) {
            attributes[i].checked = 'true';
        }
    }
    return attributes;
};


exports.convert_to_array = function (toConvert) {

    if (!(toConvert instanceof Array)) {
        if (typeof req.body.server === 'undefined') {
            toConvert = [];
        }
        else {
            toConvert = new Array(req.body.server);
        }
    }
    return toConvert;
};