import express from 'express';
import validarRoutes from './routes/validar.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';

const app = express();

app.use(express.json({ limit: '10mb' }));

app.use('/api', validarRoutes);
app.use('/api', usuarioRoutes);

export default app;