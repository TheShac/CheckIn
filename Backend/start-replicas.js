import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const replicas = [
  { id: 1, port: 3001 },
  { id: 2, port: 3002 },
  { id: 3, port: 3003 }
];

console.log(`
╔════════════════════════════════════════════════
║  🚀 INICIANDO CHECKIN CON 3 RÉPLICAS
║  ⏰ Inicio: ${new Date().toLocaleString()}    
╚════════════════════════════════════════════════
`);

replicas.forEach((replica) => {
  const env = {
    ...process.env,
    PORT: replica.port,
    REPLICA_ID: replica.id,
    NODE_ENV: 'development'
  };

  const child = spawn('node', ['server.js'], {
    cwd: __dirname,
    env: env,
    stdio: 'inherit'
  });

  child.on('error', (error) => {
    console.error(`❌ Error iniciando réplica ${replica.id}:`, error);
  });

  child.on('exit', (code) => {
    console.log(`⚠️ Réplica ${replica.id} terminada con código ${code}`);
  });
});

console.log(`
✅ Réplicas iniciadas en puertos 3001, 3002, 3003
📍 Accede a: http://localhost/api/validar?dato=ABC-123
`);
