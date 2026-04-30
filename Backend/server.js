import app from './src/app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;
const REPLICA_ID = process.env.REPLICA_ID || 'default';

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════
║  🚀 CHECKIN - RÉPLICA ${REPLICA_ID}
║  📍 Puerto: ${PORT}                      
║  🔢 PID: ${process.pid}                 
║  ⏰ Iniciado: ${new Date().toLocaleString()}
╚════════════════════════════════════════════════
  `);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});