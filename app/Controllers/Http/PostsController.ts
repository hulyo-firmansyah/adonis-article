import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, TypedSchema, rules } from '@ioc:Adonis/Core/Validator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import slugify from 'slugify'
import Post from 'App/Models/Post'
import Category from 'App/Models/Category'

const postSchema = (exceptImage: boolean = false, id: number | null = null) => {
  const ruleList: TypedSchema = {
    title: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(5),
      rules.maxLength(255),
      rules.unique({
        table: 'posts',
        column: 'title',
        whereNot: {
          id: typeof id == 'number' ? id : null
        }
      })
    ]),
    description: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(5),
      rules.maxLength(255)
    ]),
    content: schema.string({}, [
      rules.required()
    ]),
    category: schema.number([
      rules.required()
    ])
  }

  if (!exceptImage)
    ruleList.image = schema.file({
      extnames: ['jpg', 'png', 'jpeg'],
    })

  return schema.create(ruleList)
}

export default class PostsController {
  public async index({ view }: HttpContextContract) {
    const posts: Post[] = await Post
      .query()
      .preload('category')
      .preload('user')
    // return await view.renderRaw('<html><body>{{inspect(posts)}}</body></html>', { posts })
    return await view.render('pages/posts/posts', {
      title: `List of users &#8212; ${Application.appName}`,
      posts
    })
  }

  public async create({ view }: HttpContextContract) {
    const categories: Category[] = await Category.all()
    return await view.render('pages/posts/create', {
      title: `Add new user &#8212; ${Application.appName}`,
      categories
    })
  }

  public async store({ request, session, response }: HttpContextContract) {
    try {
      await request.validate({ schema: postSchema() })

      const image: any = request.file('image')
      const fileName: string = `${cuid()}.${image?.extname}`
      const imagePath: string = '/upload/posts'
      await image?.move(Application.publicPath(imagePath), {
        name: fileName,
        overwrite: true
      })

      const post: Post = await Post.create({
        title: request.input('title'),
        slug: slugify(request.input('title'), {
          lower: true
        }),
        image: `${imagePath}/${fileName}`,
        description: request.input('description'),
        content: request.input('content'),
        category_id: request.input('category'),
        author_id: 1
      })

      if (post?.$isPersisted) {
        session.flash('success', 'Add new data successfully')
        return response.redirect().toRoute('posts.create')
      }
      session.flash('error', 'Add new data failed')
      return response.redirect().toRoute('posts.create')
    } catch (errors) {
      const { messages } = errors
      const responses: { messages: Object, oldValue: Object } = {
        messages,
        oldValue: request.all()
      }
      session.flash('errors', responses)
      return response.redirect().toRoute('posts.create')
    }
  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ params, response, view }: HttpContextContract) {
    try {
      const post: Post = await Post.findOrFail(params.id)
      await post.load('category')

      const categories: Category[] = await Category.all()

      return await view.render('pages/posts/edit', {
        title: `Edit post of ${post.title} &#8212; ${Application.appName}`,
        post,
        categories
      })
    } catch (err) {
      return response.abort('not found', 404)
    }
  }

  public async update({ request, session, response, params }: HttpContextContract) {
    try {
      const image = request.file('image')
      const payload = await request.validate({ schema: postSchema(image ? false : true, parseInt(params.id)) })

      const oldImagePath: string = await (await Post.firstOrFail(params.id)).image

      // const 
      return console.log(image, payload, oldImagePath)

      const fileName: string = `${cuid()}.${image?.extname}`
      const imagePath: string = '/upload/posts'
      await image?.move(Application.publicPath(imagePath), {
        name: fileName,
        overwrite: true
      })

      return console.log(payload)
      const post: Post = await Post.findOrFail(params.id)
      await post.merge(request.only(['name', 'username', 'password', 'gender', 'address'])).save()

      if (post?.$isPersisted) {
        session.flash('success', 'Edit data successfully')
        return response.redirect().toRoute('posts.edit', { id: params.id })
      }
      session.flash('error', 'Edit data failed')
      return response.redirect().toRoute('posts.edit', { id: params.id })
    } catch ({ messages }) {
      return console.log(messages)
      const responses: { messages: Object, oldValue: Object } = {
        messages,
        oldValue: request.all()
      }
      session.flash('errors', responses)
      return response.redirect().toRoute('posts.edit', { id: params.id })
    }
  }

  public async destroy({ params, session, response }: HttpContextContract) {
    const post: Post = await Post.findOrFail(params.id)
    await post.delete()

    session.flash('success', 'Delete data successfully')
    return response.redirect().toRoute('posts.index')
  }
}
