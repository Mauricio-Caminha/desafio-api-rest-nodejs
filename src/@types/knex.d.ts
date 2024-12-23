import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    users: {
      id: string;
      email: string;
      nome: string;
      senha: string;
      criado_as: string;
      total_refeicoes: number;
      qtd_refeicoes_dentro_dieta: number;
      qtd_refeicoes_fora_dieta: number;
      sequencia_refeicoes: number;
      session_id?: string;
      atualizado_as: string;
    };

    meals: {};
  }
}
