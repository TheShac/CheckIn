import { mysqlTable, int, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';

export const logs = mysqlTable('logs_accesos', {
  id: int('id').primaryKey().autoincrement(),
  usuario_id: int('usuario_id'),
  metodo: varchar('metodo', { length: 10 }),
  dato: varchar('dato', { length: 50 }),
  autorizado: boolean('autorizado'),
  replica_id: varchar('replica_id', { length: 10 }),
  fecha: timestamp('fecha').defaultNow()
});