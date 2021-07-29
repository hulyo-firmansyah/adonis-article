import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  belongsTo,
  BelongsTo
} from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import User from './User'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public slug: string

  @column()
  public image: string

  @column()
  public description: string

  @column()
  public content: string

  @column()
  public category_id: number

  @belongsTo(() => Category, {
    foreignKey: 'category_id'
  })
  public category: BelongsTo<typeof Category>

  @column()
  public author_id: number

  @belongsTo(() => User, {
    foreignKey: 'author_id'
  })
  public user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
