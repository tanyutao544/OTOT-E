// contactController.js
// Import contact model
let Contact = require('./contactModel.js');
let Redis = require('redis');

const DEFAULT_EXPIRATION = 3600;

(async () => {
  redisClient = Redis.createClient();

  redisClient.on('error', (err) => console.log('Redis Client Error', err));

  await redisClient.connect();
})();

// Handle index actions
exports.index = async function (req, res) {
  try {
    redisClient.get('contacts', async (error, contacts) => {
      if (error) {
        console.log(error);
      }
      if (contacts != null) {
        console.log('cache hit');
        return res.status(200).json({
          status: 'success',
          message: 'Contacts retrieved successfully',
          data: JSON.parse(contacts),
        });
      }
    });
    let contacts = await Contact.find();
    await redisClient.setEx(
      'contacts',
      DEFAULT_EXPIRATION,
      JSON.stringify(contacts)
    );
    console.log('cache miss');
    return res.status(200).json({
      status: 'success',
      message: 'Contacts retrieved successfully',
      data: contacts,
    });
  } catch (err) {
    console.error(err);
  }
};
// Handle create contact actions
exports.new = async function (req, res) {
  var contact = new Contact();
  if (!(req.body.name && req.body.email)) {
    return res.status(400).json({ message: 'name and/or email is missing!' });
  }
  let exists = await Contact.exists({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });
  if (!exists) {
    contact.name = req.body.name ? req.body.name : contact.name;
    contact.gender = req.body.gender;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    // save the contact and check for errors
    contact.save();
    return res.status(201).json({
      message: 'New contact created!',
      data: contact,
    });
  } else {
    return res
      .status(400)
      .json({ message: 'Phone number and/or email already exists' });
  }
};
// Handle view contact info
exports.view = function (req, res) {
  if (!req.params.contact_id) {
    return err.status(400).json({ message: 'contact_id is missing!' });
  }
  Contact.findById(req.params.contact_id, function (err, contact) {
    if (err) res.send(err);
    res.status(200).json({
      message: 'Contact details loading..',
      data: contact,
    });
  });
};
// Handle update contact info
exports.update = async function (req, res) {
  let otherContacts = Contact.find({ _id: { $nin: req.params.contact_id } });
  let exists = await otherContacts.find({
    $or: [{ email: req.body.email }, { phone: req.body.phone }],
  });
  if (exists.length == 0) {
    Contact.findById(req.params.contact_id, function (err, contact) {
      if (err) res.send(err);
      contact.name = req.body.name ? req.body.name : contact.name;
      contact.gender = req.body.gender;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      // save the contact and check for errors
      contact.save();
      return res.status(200).json({
        message: 'Contact Info updated',
        data: contact,
      });
    });
  } else {
    return res
      .status(400)
      .json({ message: 'Phone number and/or email already exists' });
  }
};
// Handle delete contact
exports.delete = function (req, res) {
  Contact.remove(
    {
      _id: req.params.contact_id,
    },
    function (err, contact) {
      if (err) res.send(err);
      res.status(200).json({
        status: 'success',
        message: 'Contact deleted',
      });
    }
  );
};
