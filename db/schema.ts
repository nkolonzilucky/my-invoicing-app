import { pgTable, integer, timestamp, serial, text,varchar, pgEnum } from "drizzle-orm/pg-core";

export const statusEnum = pgEnum('status', ['open', 'paid', 'void', 'uncollectible'])

export const Invoices = pgTable('invoices', {
    id: serial('id').primaryKey().notNull(),
    createTs: timestamp('createTs').defaultNow().notNull(),
    value: integer('value').notNull(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull(),
    description: text('description').notNull(),
    status: statusEnum('status').notNull()
})