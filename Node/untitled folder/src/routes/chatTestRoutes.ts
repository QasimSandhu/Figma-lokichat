import express from 'express';
import TestChatBot from '../classes/TestChatBot';

const router = express.Router();

router.post('/', async (req, res)=>{
    try{
        const { oldMessages, newMessage, temperature, systemPrompt } = req.body;
        const chatResult = await TestChatBot.fetchAnswer(newMessage, systemPrompt, temperature, oldMessages);
    
        console.log('chatRes', chatResult);
        const response = {
            success: true,
            data: chatResult,
            message: 'Chat generated successfully',
            status: 200
        };
        return res.status(200).json(response);
    } catch (err) {
        console.log('erer', err);
        const response = {
            success: false,
            data: null,
            status: 500,
            message: err.message || 'Something went wrong'
        };
        return res.status(500).json(response);
    }
});

export default router;
