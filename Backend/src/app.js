import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes.js';
import validarRoutes from './routes/validar.routes.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api', usuarioRoutes);
app.use('/api', validarRoutes);

export default app;