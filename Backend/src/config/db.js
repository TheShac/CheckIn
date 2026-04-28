import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';

dotenv.config();

//const { Pool } = pkg;
// Simulación de BD en memoria
const usuariosEnMemoria = [
  {
    id: 1,
    nombre: 'Juan Carlos Pérez García',
    rut: '12345678',
    matricula: 'ABC-123',
    departamento: 'Administración',
    foto: null,
    autorizado: true,
    created_at: new Date()
  },
  {
    id: 2,
    nombre: 'María González López',
    rut: '87654321',
    matricula: 'XYZ-789',
    departamento: 'Ventas',
    foto: null,
    autorizado: true,
    created_at: new Date()
  }
];

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//export const db = drizzle(pool);

// Simulación de Drizzle ORM
export const db = {
  select: () => ({
    from: (tabla) => ({
      where: async (condicion) => {
        // Simular búsqueda
        return usuariosEnMemoria.filter(u => {
          if (condicion.toString().includes('rut')) {
            return u.rut === condicion.value;
          }
          if (condicion.toString().includes('matricula')) {
            return u.matricula === condicion.value;
          }
          return false;
        });
      }
    })
  }),
  insert: (tabla) => ({
    values: async (datos) => {
      const nuevoUsuario = {
        id: usuariosEnMemoria.length + 1,
        ...datos,
        created_at: new Date()
      };
      usuariosEnMemoria.push(nuevoUsuario);
      return [nuevoUsuario];
    }
  })
};

// Función auxiliar para búsquedas
export const findByRut = (rut) => {
  return usuariosEnMemoria.find(u => u.rut === rut);
};

export const findByMatricula = (matricula) => {
  return usuariosEnMemoria.find(u => u.matricula === matricula);
};

export const createUsuario = (datos) => {
  const nuevoUsuario = {
    id: usuariosEnMemoria.length + 1,
    ...datos,
    created_at: new Date()
  };
  usuariosEnMemoria.push(nuevoUsuario);
  return nuevoUsuario;
};

export const getAllUsuarios = () => usuariosEnMemoria;
