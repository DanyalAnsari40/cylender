import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true }, // Employee ID or 'admin'
  recipientRole: { type: String, required: true, enum: ['admin', 'employee'] },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['stock_assigned', 'stock_returned', 'system'] 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  details: {
    stockType: String,
    quantity: Number,
    employeeName: String
  },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification; 