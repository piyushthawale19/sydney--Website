const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  dateTime: {
    type: Date,
    required: true,
    index: true
  },
  endDateTime: {
    type: Date
  },
  venue: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    required: true,
    default: 'Sydney',
    index: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    maxlength: 150
  },
  category: {
    type: String,
    trim: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  sourceSite: {
    type: String,
    required: true,
    trim: true
  },
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: [String],
    enum: ['new', 'updated', 'inactive', 'imported'],
    default: ['new']
  },
  imported: {
    type: Boolean,
    default: false
  },
  importedAt: {
    type: Date
  },
  importedBy: {
    type: String,
    trim: true
  },
  importNotes: {
    type: String,
    trim: true
  },
  lastScraped: {
    type: Date,
    default: Date.now
  },
  price: {
    type: String,
    trim: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  organizerName: {
    type: String,
    trim: true
  },
  organizerUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
eventSchema.index({ title: 1, dateTime: 1 });
eventSchema.index({ city: 1, dateTime: 1 });
eventSchema.index({ category: 1, dateTime: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ lastScraped: 1 });

// Compound text index for search
eventSchema.index({
  title: 'text',
  description: 'text',
  venue: 'text',
  category: 'text'
});

// Virtual for formatted short description
eventSchema.virtual('formattedShortDescription').get(function() {
  if (this.shortDescription) return this.shortDescription;
  if (this.description) {
    return this.description.length > 150 
      ? this.description.substring(0, 147) + '...' 
      : this.description;
  }
  return '';
});

// Method to check if event is outdated
eventSchema.methods.isOutdated = function() {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return this.dateTime < weekAgo;
};

// Static method to find similar events
eventSchema.statics.findSimilar = async function(title, dateTime) {
  const dateLower = new Date(dateTime);
  dateLower.setHours(dateLower.getHours() - 2);
  const dateUpper = new Date(dateTime);
  dateUpper.setHours(dateUpper.getHours() + 2);
  
  return this.findOne({
    title: { $regex: new RegExp(title, 'i') },
    dateTime: { $gte: dateLower, $lte: dateUpper }
  });
};

module.exports = mongoose.model('Event', eventSchema);
