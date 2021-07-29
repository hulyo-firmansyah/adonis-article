// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PostsController {

    public async index(ctx) {
        const { request, response } = ctx
        console.log(request.all(), request.url(), request.body(), request.input('a'), request.param('a'), request.ips())
        console.log(response)
        return '<h2>Posts</h2><script>console.log("hello world")</script>'
    }

}
