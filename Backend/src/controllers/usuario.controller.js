import { db } from '../config/db.js';
import { usuarios } from '../models/usuario.model.js';
import { validarRUT } from '../utils/rut.js';

export const crearUsuario = async (req, res) => {
  const { nombre, rut, matricula, departamento, foto, autorizado } = req.body;

  try {
    // Validar campos obligatorios
    if (!nombre || !rut || !matricula) {
      return res.status(400).json({
        error: "Faltan campos obligatorios"
      });
    }

    // Validar RUT
    if (!validarRUT(rut)) {
      return res.status(400).json({
        error: "RUT inválido"
      });
    }

    // Limpiar RUT (guardar sin puntos ni DV)
    const rutLimpio = rut.split('-')[0].replace(/\./g, '');

    // Insertar en DB
    await db.insert(usuarios).values({
      nombre,
      rut: rutLimpio,
      matricula,
      departamento,
      foto,
      autorizado
    });

    return res.status(201).json({
      mensaje: "Usuario creado correctamente"
    });

  } catch (error) {
    res.status(500).json({
      error: "Error al crear usuario"
    });
  }
};