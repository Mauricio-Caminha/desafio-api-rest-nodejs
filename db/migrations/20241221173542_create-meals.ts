import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary();
    table.uuid("user_id").notNullable().references("id").inTable("users");
    table.string("nome").notNullable();
    table.string("descricao").notNullable();
    table.timestamp("data_hora").defaultTo(knex.fn.now()).notNullable();
    table.integer("esta_dentro_da_dieta").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
