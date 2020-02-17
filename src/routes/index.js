import express from 'express';

import inject from './inject';
import search from './search';

const router = express.Router();

router.use('/inject', inject);
router.use('/search', search);

export default router;
