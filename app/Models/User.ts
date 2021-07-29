import { DateTime } from 'luxon'
import { afterFetch, BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'name' })
  public name: String

  @column()
  public username: String

  @column({ serializeAs: null })
  public password: string

  @column()
  public gender: String

  @column()
  public address: String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterFetch()
  public static async afterFetchHook(users: User[]) {
    users.map((user: User, index: number, arr: Array<User>) => {
      return user.gender === 'm' ? arr[index].gender = 'Male' : arr[index].gender = 'Female'
    })
  }
}
