/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Property = use('App/Models/Property');
/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
    /**
     * Show a list of all properties.
     * GET properties
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async index({ request, response, view }) {
        try {
            const { latitude, longitude } = request.all();

            const properties = Property.query()
                .with('images')
                .nearBy(latitude, longitude, 10)
                .fetch();

            return properties;
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao listar os imóveis!' });
        }
    }

    /**
     * Create/save a new property.
     * POST properties
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async store({ auth, request, response }) {
        try {
            const { id } = auth.user;
            const data = request.only([
                'title',
                'address',
                'latitude',
                'longitude',
                'price',
            ]);

            const property = await Property.create({ ...data, user_id: id });

            return property;
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao cadastrar o imóvel!' });
        }
    }

    /**
     * Display a single property.
     * GET properties/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     * @param {View} ctx.view
     */
    async show({ params, request, response, view }) {
        try {
            const property = await Property.findOrFail(params.id);

            await property.load('images');

            return property;
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao exibir o imóvel!' });
        }
    }

    /**
     * Update property details.
     * PUT or PATCH properties/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async update({ params, request, response }) {
        try {
            const property = await Property.findOrFail(params.id);

            const data = request.only([
                'title',
                'address',
                'latitude',
                'longitude',
                'price',
            ]);

            property.merge(data);

            await property.save();

            return property;
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao atualizar o imóvel!' });
        }
    }

    /**
     * Delete a property with id.
     * DELETE properties/:id
     *
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Response} ctx.response
     */
    async destroy({ auth, params, request, response }) {
        try {
            const property = await Property.findOrFail(params.id);

            if (property.user_id !== auth.user.id) {
                return response.status(401).send({ error: 'Not authorized' });
            }

            await property.delete();
            return response.status(201).send({ message: 'Property Deleted' });
        } catch (error) {
            return response
                .status(400)
                .send({ error: 'Falha ao excluir o imóvel!' });
        }
    }
}

module.exports = PropertyController;
