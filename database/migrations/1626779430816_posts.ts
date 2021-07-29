import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Posts extends BaseSchema {
  protected tableName = 'posts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title', 75)
      table.string('slug', 255)
      table.string('description', 255)
      table.text('content')
      table.integer('category_id', 11).unsigned()
      table.integer('author_id', 11).unsigned()

      table
        .foreign('category_id')
        .references('categories.id')
        .onDelete('CASCADE')
      table
        .foreign('author_id')
        .references('users.id')
        .onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      // table.timestamp('created_at', { useTz: true })
      // table.timestamp('updated_at', { useTz: true })
      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
