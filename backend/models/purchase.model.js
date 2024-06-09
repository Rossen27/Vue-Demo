import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema({
  stockCode: {
    type: String,
    required: true
  },
  stockData: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default mongoose.model('Purchase', purchaseSchema);