import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core"

export const reminders = sqliteTable("reminders", {
    id:                 integer("id").primaryKey({ autoIncrement: true }),
    name:               text("name").notNull(),
    amount:             real("amount").notNull(),
    last_reminder:      integer("last_reminder"),
    interval:           integer("interval").notNull(),
})