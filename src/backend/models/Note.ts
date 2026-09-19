import mongoose, { Schema, Document } from 'mongoose';

// 1. Define the TypeScript Interface
export interface INote extends Document {
user: mongoose.Types.ObjectId;
title: string;
excerpt: string;
content: any; // You can type this more strictly later if you define your Tiptap JSON shape!
isFavorite: boolean;
tags: string[];
createdAt: Date;
updatedAt: Date;
}

// 2. Create the Mongoose Schema
const noteSchema = new Schema({
user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User' // This tells Mongoose this ID references the User collection
  },
title: {
type: String,
required: true,
default: 'Untitled Note'
},
excerpt: {
type: String,
default: ''
},
content: {
type: Schema.Types.Mixed,
default: {}
},
isFavorite: {
type: Boolean,
default: false
},
tags: {
type: [String],
default: []
}
}, {
timestamps: true
});

// 3. Export the typed model
const Note = mongoose.model<INote>('Note', noteSchema);
export default Note;

