// contactController.js
// Import contact model
Contact = require('./contactModel');
// Handle index actions
exports.index = function (req, res) {
    Contact.get(function (err, contacts) {
        if (err) {
            res.json({
                status: "error",
                message: err,
            });
        }
        res
        .status(200)
        .json({
            status: "success",
            message: "Contacts retrieved successfully",
            data: contacts
        });
    });
};
// Handle create contact actions
exports.new = function (req, res) {
    var contact = new Contact();
    if(!Contact.exists( {$or: [{ email: req.body.email}, {phone: req.body.phone }]})) {
        console.log(Contact.exist( {$or: [{ email: req.body.email}, {phone: req.body.phone }]}))
        contact.name = req.body.name ? req.body.name : contact.name;
        contact.gender = req.body.gender;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
// save the contact and check for errors
        contact.save(function (err) {
            if (err)
                res.json(err);
            res
            .status(201)
            .json({
                message: 'New contact created!',
                data: contact
            });
        });
    } else {
        return res
            .status(400)
            .json({ message: "Phone number and/or email already exists"})
    }
};
// Handle view contact info
exports.view = function (req, res) {
    Contact.findById(req.params.contact_id, function (err, contact) {
        if (err)
            res.send(err);
        res
        .status(200)
        .json({
            message: 'Contact details loading..',
            data: contact
        });
    });
};
// Handle update contact info
exports.update = function (req, res) {
    if(!Contact.exists( {$or: [{ email: req.body.email}, {phone: req.body.phone }]})) {
        Contact.findById(req.params.contact_id, function (err, contact) {
            if (err)
                res.send(err);
        contact.name = req.body.name ? req.body.name : contact.name;
            contact.gender = req.body.gender;
            contact.email = req.body.email;
            contact.phone = req.body.phone;
        // save the contact and check for errors
            contact.save(function (err) {
                if (err)
                    res.json(err);
                res
                .status(200)
                .json({
                    message: 'Contact Info updated',
                    data: contact
                });
            });
        });
    } else {
        return res
            .status(400)
            .json({ message: "Phone number and/or email already exists"})
    }
};
// Handle delete contact
exports.delete = function (req, res) {
    Contact.remove({
        _id: req.params.contact_id
    }, function (err, contact) {
        if (err)
            res.send(err);
    res.json({
            status: "success",
            message: 'Contact deleted'
        });
    });
};
