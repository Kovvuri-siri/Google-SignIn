import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    filename: { type: String, required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    contentText: { type: String },
    mimeType: { type: String },
    size: { type: Number }
  },
  { timestamps: true }
);

export const Note = mongoose.model('Note', noteSchema);