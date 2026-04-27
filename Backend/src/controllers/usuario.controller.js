import { db } from '../config/db.js';
import { usuarios } from '../models/usuario.model.js';
import { validarRUT } from '../utils/rut.js';

export const crearUsuario = async (req, res) => {
  const { nombre, rut, matricula, departamento, foto, autorizado } = req.body;

  try {
    if (!nombre || !rut || !matricula) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (!validarRUT(rut)) {
      return res.status(400).json({ error: "RUT inválido" });
    }

    const rutLimpio = rut.split('-')[0].replace(/\./g, '');

    const nuevo = await db.insert(usuarios).values({
      nombre,
      rut: rutLimpio,
      matricula,
      departamento,
      foto,
      autorizado
    }).returning();

    return res.status(201).json({
      mensaje: "Usuario creado correctamente",
      usuario: nuevo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};