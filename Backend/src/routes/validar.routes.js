import express from 'express';
import { validar } from '../controllers/validar.controller.js';

const router = express.Router();

router.get('/validar', validar);

export default router;