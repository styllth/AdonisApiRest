class HomeController {
    index({ request, response, view }) {
        return response.status(200).send({ sucess: 'Api is Running' });
    }
}

module.exports = HomeController;
