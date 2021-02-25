const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItinerarySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    city: {
        type: String,
    required: true
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    price: {
        type: Number
    },
    hashtag: {
     type:[String]
    },
    activities: {
    type: [String],
    required: true
  },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Itinerary = mongoose.model('itinerary', ItinerarySchema);