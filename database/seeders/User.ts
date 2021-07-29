import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await Database.table('users').multiInsert([
      {
        name: 'Jovanka',
        username: 'jovan',
        password: await Hash.make('jovan'),
        gender: 'm',
        address: 'Singosari'
      },
      {
        name: 'Doni Andry',
        username: 'doni',
        password: await Hash.make('doni'),
        gender: 'm',
        address: 'Singosari'
      },
      {
        name: 'Admin Anton',
        username: 'admin',
        password: await Hash.make('admin'),
        gender: 'm',
        address: 'Malang'
      },
      {
        name: 'Anton',
        username: 'anton',
        password: await Hash.make('anton'),
        gender: 'm',
        address: 'Malang'
      },
    ])
  }
}
