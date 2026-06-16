const { Router } = require('express')
const router = Router();
const { getCommts, getCommetById,
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
} = require('../controllers/comment.controller');

router.get('/', getCommts);
router.get('/:id', getCommetById);


router.post('/', createComment);
router.get('/post/:postId', getCommentsByPost);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);

module.exports = router;