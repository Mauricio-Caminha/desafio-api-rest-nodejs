import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table.string("email").notNullable();
    table.string("nome").notNullable();
    table.string("senha").notNullable();
    table.timestamp("criado_as").defaultTo(knex.fn.now()).notNullable();
    table.integer("total_refeicoes").notNullable().defaultTo(0);
    table.integer("qtd_refeicoes_dentro_dieta").notNullable().defaultTo(0);
    table.integer("qtd_refeicoes_fora_dieta").notNullable().defaultTo(0);
    table.integer("sequencia_refeicoes").notNullable().defaultTo(0);
    table.timestamp("atualizado_as").defaultTo(knex.fn.now()).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
}
