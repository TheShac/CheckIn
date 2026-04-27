import { db } from '../config/db.js';
import { usuarios } from '../models/usuario.model.js';
import { eq } from 'drizzle-orm';
import { validarRUT } from '../utils/rut.js';

export const validar = async (req, res) => {
  const { dato } = req.query;

  try {
    let usuario = null;

    if (dato.includes('-')) {

      if (!validarRUT(dato)) {
        return res.json({ autorizado: false, mensaje: "RUT inválido" });
      }

      const rutLimpio = dato.split('-')[0].replace(/\./g, '');

      const resultado = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.rut, rutLimpio));

      usuario = resultado[0];

    } else {

      const resultado = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.matricula, dato));

      usuario = resultado[0];
    }

    if (!usuario || !usuario.autorizado) {
      return res.json({
        autorizado: false,
        mensaje: "No autorizado"
      });
    }

    return res.json({
      autorizado: true,
      usuario
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};