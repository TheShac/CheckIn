import { db } from '../config/db.js';
import { usuarios } from '../models/usuario.model.js';
import { logs } from '../models/log.model.js';
import { eq } from 'drizzle-orm';
import { validarRUT } from '../utils/rut.js';

export const validar = async (req, res) => {
  const { dato } = req.query;

  try {
    if (!dato) {
      return res.status(400).json({ error: "Debe enviar un dato" });
    }

    let usuario = null;
    let metodo = '';

    // 🔥 Detectar si es RUT por formato real (NO por el guión)
    const esRut = /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/.test(dato);

    if (esRut) {

      metodo = 'RUT';

      if (!validarRUT(dato)) {
        return res.json({
          autorizado: false,
          mensaje: "RUT inválido",
          replica: res.locals.replicaId
        });
      }

      const rutLimpio = dato.split('-')[0].replace(/\./g, '');

      const resultado = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.rut, rutLimpio));

      usuario = resultado[0];

    } else {

      metodo = 'PATENTE';

      const datoNormalizado = dato.toUpperCase().trim();

      const resultado = await db
        .select()
        .from(usuarios)
        .where(eq(usuarios.matricula, datoNormalizado));

      usuario = resultado[0];
    }

    const autorizado = usuario && usuario.autorizado ? true : false;

    // 🔥 LOG DE ACCESO
    await db.insert(logs).values({
      usuario_id: usuario ? usuario.id : null,
      metodo,
      dato,
      autorizado,
      replica_id: res.locals.replicaId
    });

    if (!autorizado) {
      return res.json({
        autorizado: false,
        mensaje: "No autorizado",
        replica: res.locals.replicaId
      });
    }

    return res.json({
      autorizado: true,
      usuario,
      replica: res.locals.replicaId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};