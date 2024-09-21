const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
