import { db, findByMatricula, findByRut } from '../config/db.js';
import { usuarios } from '../models/usuario.model.js';
import { eq } from 'drizzle-orm';
import { validarRUT } from '../utils/rut.js';

export const validar = async (req, res) => {
  const { dato } = req.query;
  const replicaId = process.env.REPLICA_ID || 'default';

  try {
    let usuario = null;

    if (dato.includes('-')) {

      if (!validarRUT(dato)) {
        return res.json({ autorizado: false, mensaje: "RUT inválido", 
        procesadorPor: `Réplica ${replicaId}` });
      }

      const rutLimpio = dato.split('-')[0].replace(/\./g, '');
      usuario = findByRut(rutLimpio);

    } else {
      // Es Matrícula
      usuario = findByMatricula(dato);
    }

    if (!usuario || !usuario.autorizado) {
      return res.json({
        autorizado: false,
        mensaje: "No autorizado", 
        procesadorPor: `Réplica ${replicaId}`
      });
    }

    return res.json({
      autorizado: true,
      usuario, 
      procesadorPor: `Réplica ${replicaId}`
    });

  } catch (error) {
    res.status(500).json({ error: error.message, 
        procesadorPor: `Réplica ${replicaId}` });
  }
};