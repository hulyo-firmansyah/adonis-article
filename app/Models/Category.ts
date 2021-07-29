import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  HasMany,
  hasMany
} from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public category: string

  @hasMany(() => Post, {
    localKey: 'category_id'
  })
  public posts: HasMany<typeof Post>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
