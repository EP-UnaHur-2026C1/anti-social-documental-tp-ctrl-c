const { Router } = require('express');
const router = Router();
const { 
    getComments,      
    getCommentById,   
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment     
} = require('../controllers/comment.controller');

router.get('/', getComments);
router.get('/:id', getCommentById);

router.post('/', createComment);
router.get('/post/:postId', getCommentsByPost);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;