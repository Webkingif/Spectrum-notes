import express from 'express';
import { createNote, getNoteById, updateNote, getNotes, deleteNote } from '../controllers/noteController';
import { protect } from '../middlewares/authMiddleware'; 
const router = express.Router();



// Apply the protect middleware to ALL note routes
router.use(protect); 


router.route('/')
  .get(getNotes)
  .post(createNote); 

router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

export default router;