import { db } from '../config/db.js';
import { usuarios } from '../models/usuario.model.js';
import { createUsuario, getAllUsuarios } from '../config/db.js';
import { validarRUT } from '../utils/rut.js';

export const crearUsuario = async (req, res) => {
  const { nombre, rut, matricula, departamento, foto, autorizado } = req.body;
  const replicaId = process.env.REPLICA_ID || 'default';

  try {
    if (!nombre || !rut || !matricula) {
      return res.status(400).json({ 
        error: "Faltan campos obligatorios",
        procesadoPor: `Réplica ${replicaId}` 
      });
    }

    if (!validarRUT(rut)) {
      return res.status(400).json({ 
        error: "RUT inválido",
        procesadoPor: `Réplica ${replicaId}` 
      });
    }

    const rutLimpio = rut.split('-')[0].replace(/\./g, '');

    const nuevoUsuario = createUsuario({
      nombre,
      rut: rutLimpio,
      matricula,
      departamento: departamento || '',
      foto: foto || null,
      autorizado: autorizado !== undefined ? autorizado : true
    });

    return res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: nuevoUsuario,
      procesadoPor: `Réplica ${replicaId}`
    });

  } catch (error) {
    console.error(`[Réplica ${replicaId}] Error:`, error);
    res.status(500).json({ 
      error: error.message,
      procesadoPor: `Réplica ${replicaId}` 
    });
  }
};

export const obtenerUsuarios = async (req, res) => {
  const replicaId = process.env.REPLICA_ID || 'default';

  try {
    const usuarios = getAllUsuarios();
    res.json({
      usuarios,
      total: usuarios.length,
      procesadoPor: `Réplica ${replicaId}`
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      procesadoPor: `Réplica ${replicaId}`
    });
  }
};
