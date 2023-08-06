import express from 'express';

let router = express.Router();

router.get('', (req, res) => {
	res.status(200).json({ok:true})
})
router.get('/', (req, res) => {
	res.status(200).json({ok:true})
})

export default router;