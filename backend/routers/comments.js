const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

// API để thêm bình luận mới
router.post('/', async (req, res) => {
    const { user_id, story_id, content } = req.body;
    
    if (!user_id || !story_id || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const newComment = new Comment({ user_id, story_id, content });
        await newComment.save();
        res.status(201).json({ message: 'Comment added', commentId: newComment._id });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// API để lấy danh sách bình luận
router.get('/:story_id', async (req, res) => {
    const { story_id } = req.params;

    try {
        const comments = await Comment.find({ story_id }).sort({ created_at: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;
