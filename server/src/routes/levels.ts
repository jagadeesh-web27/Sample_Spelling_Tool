import express from 'express';
import { getLevels} from '../controllers/index';

const router = express.Router();

router.get('/levels', getLevels);
router.put('level')

export default router;