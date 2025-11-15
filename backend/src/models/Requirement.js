import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    stakeholderRole: {
      type: String,
      enum: ['citizen', 'govt', 'admin', 'other'],
      default: 'citizen'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Requirement', RequirementSchema);