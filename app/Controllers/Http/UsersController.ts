import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async index({ view }: HttpContextContract) {
    const users: Array<User> = await User.all()
    return await view.render('pages/users/users', {
      title: `List of users &#8212; ${Application.appName}`,
      users
    })
  }

  public async create({ view }: HttpContextContract) {
    return await view.render('pages/users/create', {
      title: `Add new user &#8212; ${Application.appName}`,
    })
  }

  public async store({ request, response, session, view }: HttpContextContract) {
    const postSchema = schema.create({
      name: schema.string({}, [
        rules.minLength(3)
      ]),
      username: schema.string({ trim: true }, [
        rules.required()
      ]),
      password: schema.string({ trim: true }, [
        rules.minLength(3),
        rules.required(),
        rules.regex(/[A-Z0-9]/)
      ]),
      gender: schema.enum(['m', 'f'], [
        rules.required()
      ]),
      address: schema.string({ trim: true }, [
        rules.required()
      ])
    })
    // return await view.renderRaw('<html><body>{{inspect(request.all())}}</body></html>', { request })
    try {
      await request.validate({ schema: postSchema })
    } catch ({ messages }) {
      const responses: { messages: Object, oldValue: Object } = {
        messages,
        oldValue: request.all()
      }
      session.flash('errors', responses)
      return response.redirect().toRoute('users.create')
    }

    const user: User = await User.create(request.except(['_csrf']))
    // return await view.renderRaw('<html><body>{{inspect(user)}}</body></html>', { user })
    if (user?.$isPersisted) {
      session.flash('success', 'Add new data successfully')
      return response.redirect().toRoute('users.create')
    }
    session.flash('error', 'Add new data failed')
    return response.redirect().toRoute('users.create')
  }

  public async show({ params, view, response }: HttpContextContract) {
    try {
      const user: User = await User.findOrFail(params.id)

    } catch (err) {
      return response.abort('not found', 404)
      return await view.renderRaw('<html><body>{{inspect(params)}} {{inspect(err)}}</body></html>', { err, params })
    }

  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ params, response, session }: HttpContextContract) {
    const user: User = await User.findOrFail(params.id)
    await user.delete()

    session.flash('success', 'Delete data successfully')
    return response.redirect().toRoute('users.index')
  }
}
