import { mysqlTable, varchar, int, boolean, text } from 'drizzle-orm/mysql-core';

export const usuarios = mysqlTable('usuarios', {
  id: int('id').primaryKey().autoincrement(),
  nombre: varchar('nombre', { length: 100 }).notNull(),
  rut: varchar('rut', { length: 20 }).unique(),
  matricula: varchar('matricula', { length: 20 }).unique(),
  departamento: varchar('departamento', { length: 100 }),
  foto: text('foto'),
  autorizado: boolean('autorizado').default(false)
});