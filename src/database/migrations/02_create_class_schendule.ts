import Knex from 'knex';

export async function up(knex: Knex){
    //Criar a tabela
    return knex.schema.createTable('class_schedule',table => {
        table.increments('id').primary();
        table.integer('week_day').notNullable();
        table.integer('begin_class').notNullable();
        table.integer('final_class').notNullable();

        table.integer('class_id')
        .notNullable()
        .references('id')
        .inTable('classes')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
    });
}

export async function down(knex: Knex){
    //Voltar atrás/deletar a tabela.s
    return knex.schema.dropTable('class_schedule');
}