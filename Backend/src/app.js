import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes.js';
import validarRoutes from './routes/validar.routes.js';

const app = express();
const REPLICA_ID = process.env.REPLICA_ID || 'default';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Middleware para agregar REPLICA_ID a las respuestas
app.use((req, res, next) => {
  // Guardar referencia de réplica
  res.locals.replicaId = REPLICA_ID;
  
  // Loguear petición
  console.log(`[Réplica ${REPLICA_ID}] ${req.method} ${req.path}`);
  
  next();
});

app.use('/api', usuarioRoutes);
app.use('/api', validarRoutes);

export default app; 
