const CONTROLLER = {
    API: require('./controller/api')
}

module.exports = (app) => {
    app.post('/api/v1/validar', CONTROLLER.API.ValidarXML)
}