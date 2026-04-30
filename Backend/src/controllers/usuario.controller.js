import { db } from '../config/db.js';
import { usuarios } from '../models/usuario.model.js';
import { validarRUT } from '../utils/rut.js';
import { eq } from 'drizzle-orm';

export const crearUsuario = async (req, res) => {

  // 🔥 SOLO RÉPLICA LÍDER PUEDE CREAR
  if (process.env.REPLICA_ID !== '1') {
    return res.status(403).json({
      error: "Solo la réplica 1 (líder) puede crear usuarios"
    });
  }

  const { nombre, rut, matricula, departamento, foto, autorizado } = req.body;

  try {
    if (!nombre || !rut || !matricula) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (!validarRUT(rut)) {
      return res.status(400).json({ error: "RUT inválido" });
    }

    const rutLimpio = rut.split('-')[0].replace(/\./g, '');

    const result = await db.insert(usuarios).values({
      nombre,
      rut: rutLimpio,
      matricula: matricula.toUpperCase(),
      departamento,
      foto,
      autorizado
    });

    const usuarioCreado = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.id, result.insertId));

    return res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: usuarioCreado[0],
      replica: process.env.REPLICA_ID
    });

  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Usuario ya existe" });
    }

    res.status(500).json({ error: error.message });
  }
};