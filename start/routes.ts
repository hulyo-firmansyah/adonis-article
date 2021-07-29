/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import UsersController from 'App/Controllers/Http/UsersController'

Route.get('/', async ({ view }) => {
  return view.render('welcome')
}).as('home')

Route.group(() => {
  Route.get('/', async (ctx: HttpContextContract) => {
    return new UsersController().index(ctx)
  }).as('users.index')

  Route.get('/create', async (ctx: HttpContextContract) => {
    return new UsersController().create(ctx)
  }).as('users.create')

  Route.post('/create', async (ctx: HttpContextContract) => {
    return new UsersController().store(ctx)
  }).as('users.store')

  Route.get('/edit/:id', async (ctx: HttpContextContract) => {
    return new UsersController().edit(ctx)
  }).as('users.edit')

  Route.put('/edit/:id', async (ctx: HttpContextContract) => {
    return new UsersController().update(ctx)
  }).as('users.update')

  Route.delete('/delete/:id', async (ctx: HttpContextContract) => {
    return new UsersController().destroy(ctx)
  }).as('users.delete')
}).prefix('users')

Route.resource('posts', 'PostsController')