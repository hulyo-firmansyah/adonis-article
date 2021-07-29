import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UserMigrations extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 35).notNullable()
      table.string('username', 25).notNullable()
      table.string('password', 255).notNullable()
      table.enum('gender', ['m', 'f']).notNullable()
      table.string('address', 255).notNullable()
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
