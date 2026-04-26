import express from 'express';
import { crearUsuario } from '../controllers/usuario.controller.js';

const router = express.Router();

router.post('/usuarios', crearUsuario);

export default router;