/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const User = use('App/Models/User');

/**
 * Resourceful controller for interacting with users
 */
class UserController {
    /**
     * Show a list of all users.
     * GET users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {
            return await User.all();
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao listar os usuário!' });
        }
    }

    /**
     * Create/save a new user.
     * POST users
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ request, response }) {
        try {
            const data = request.only(['username', 'email', 'password']);

            let user = await User.findBy('email', data.email);

            if (!user) {
                user = await User.create(data);
                return user;
            }

            return response
                .status(400)
                .send({ mesege: 'Usuário já Cadastrado' });
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao registrar o usuário!' });
        }
    }

    /**
     * Display a single user.
     * GET users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {
            return await User.findOrFail(params.id);
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao listar o usuário!' });
        }
    }

    /**
     * Update user details.
     * PUT or PATCH users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {
            const user = await User.findOrFail(params.id);

            const data = request.only(['username', 'email', 'password']);

            user.merge(data);

            await user.save();

            return user;
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao alterar o Usuário' });
        }
    }

    /**
     * Delete a user with id.
     * DELETE users/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ params, request, response }) {
        try {
            const user = await User.findOrFail(params.id);

            await user.delete();

            return response.status(201).send({ message: 'Usuário Excluído' });
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao excuir o Usuário' });
        }
    }
}

module.exports = UserController;
