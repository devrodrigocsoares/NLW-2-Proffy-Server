import Knex from 'knex';

export async function up(knex: Knex){
    //Criar a tabela
    return knex.schema.createTable('connections_teacher',table => {
        table.increments('id').primary();

        table.integer('user_id')
        .notNullable()
        .references('users')
        .inTable('classes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')

        table.timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
        .notNullable();

    });
}

export async function down(knex: Knex){
    //Voltar atrás/deletar a tabela.s
    return knex.schema.dropTable('connections_teacher');
}