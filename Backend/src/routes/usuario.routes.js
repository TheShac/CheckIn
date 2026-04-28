import express from 'express';
import { crearUsuario, obtenerUsuarios } from '../controllers/usuario.controller.js';

const router = express.Router();

router.post('/usuarios', crearUsuario);
router.get('/usuarios', obtenerUsuarios)

export default router;