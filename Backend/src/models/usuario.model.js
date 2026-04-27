import { pgTable, varchar, integer, boolean, text } from 'drizzle-orm/pg-core';

export const usuarios = pgTable('usuarios', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  nombre: varchar('nombre', { length: 100 }),
  rut: varchar('rut', { length: 20 }),
  matricula: varchar('matricula', { length: 20 }),
  departamento: varchar('departamento', { length: 100 }),
  foto: text('foto'),
  autorizado: boolean('autorizado')
});