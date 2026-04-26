import { mysqlTable, varchar, int, boolean, text } from 'drizzle-orm/mysql-core';

export const usuarios = mysqlTable('usuarios', {
  id: int('id').primaryKey().autoincrement(),
  nombre: varchar('nombre', { length: 100 }),
  rut: varchar('rut', { length: 20 }),
  matricula: varchar('matricula', { length: 20 }),
  departamento: varchar('departamento', { length: 100 }),
  foto: text('foto'),
  autorizado: boolean('autorizado')
});