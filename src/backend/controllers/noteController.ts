import type { Response } from 'express';
import Note from '../models/Note';
import type {AuthRequest} from "../middlewares/authMiddleware";
import User from '../models/User';


// @desc Create a new note
// @route POST /api/notes
export const createNote = async (req: AuthRequest, res: Response): Promise<void> => {
try {
   const user = await User.findById(req.user._id);
    
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // 1. Instantly check the counter attached to the user
    if (user.tier === 'free' && user.noteCount >= 3) {
      res.status(403).json({ message: "Free tier limit reached.", limitReached: true });
      return;
    }
    
    if (user.tier === 'plus' && user.noteCount >= 6) {
      res.status(403).json({ message: "Plus tier limit reached.", limitReached: true });
      return;
    }
   const { title, excerpt, content, isFavorite, tags } = req.body;

if(!req.user){
	res.status(401).json({message:"User not authenticated"});
	return
}

const newNote = await Note.create({
title,
excerpt,
content,
isFavorite,
tags,
user: req.user._id
});
user.noteCount +=1;
await user.save();

res.status(201).json(newNote); //sends the response back to the frontend.

} catch (error) {
console.error("Error creating note:", error);
res.status(500).json({ message: 'Failed to create note' });
}
};



// @desc Get a single note by ID
// @route GET /api/notes/:id
export const getNoteById = async (req: AuthRequest, res: Response): Promise<void> => {
try {
const { id } = req.params;
const note = await Note.findById(id);

// If the note doesn't exist, return a 404 Not Found error
if (!note) {
res.status(404).json({ message: 'Note not found' });
return;
}
   if (note.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized to view this note' });
      return;
    }

res.status(200).json(note);
} catch (error) {
// If the ID is completely invalid (e.g., "123" instead of a valid MongoDB ObjectId),
// Mongoose throws an error. We also treat this as a 404.
res.status(404).json({ message: 'Invalid Note ID' });
}
};

// @desc Update an existing note
// @route PUT /api/notes/:id
export const updateNote = async (req: AuthRequest, res: Response): Promise<void> => {
try {
const { id } = req.params;

// Find the note by ID and update it.
// { new: true } ensures Mongoose returns the newly updated document, not the old one.
const updatedNote = await Note.findByIdAndUpdate(id, req.body, { returnDocument: "after" });

if (!updatedNote) {
res.status(404).json({ message: 'Note not found' });
return;
}
 if (updatedNote.user.toString() !== req.user._id.toString()) {
      res.status(401).json({ message: 'Not authorized to view this note' });
      return;
    }

res.status(200).json(updatedNote);
} catch (error) {
console.error("Error updating note:", error);
res.status(500).json({ message: 'Failed to update note' });
}
};



// @desc Get all notes
// @route GET /api/notes
export const getNotes = async (req: AuthRequest, res: Response): Promise<void> => {
try {
// .find() gets everything. .sort({ updatedAt: -1 }) puts the newest first!
   const notes = await Note.find({ user: req.user._id }).select("-content").sort({ updatedAt: -1 });
res.status(200).json(notes);
} catch (error) {
console.error("Error fetching notes:", error);
res.status(500).json({ message: 'Failed to fetch notes' });
}
};

// @desc Delete a note
// @route DELETE /api/notes/:id
export const deleteNote = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const note = await Note.findById(req.params.id);

    // Verify note exists and belongs to the user...
    if (!note || note.user.toString() !== req.user._id.toString()) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    await note.deleteOne();

    // DECREMENT THE COUNTER HERE
    // $inc is a MongoDB operator that safely subtracts 1 from the field
    await User.findByIdAndUpdate(req.user._id, { 
      $inc: { noteCount: -1 } 
    });

    res.status(200).json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete note' });
  }
};














