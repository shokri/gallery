const gallery = require('./gallery')

module.exports = (app) => {

	app.get('/api/gallery', gallery.getAll)

	app.get('/api/gallery/sorted', gallery.getSorted)

	app.get('/api/gallery/:id', gallery.getImage)

	app.post('/api/vote', gallery.vote)

	app.post('/api/gallery/search', gallery.search)

}