const service = require('../api/gallery')

exports.getAll = (req, res, next) => {
	service.getLists()
	.then(lists => res.json(lists))
	.then(err => next(err))
}

exports.getImage = (req, res, next) => {
	service.getImage(req.params.id)
	.then(list => res.json(list))
	.then(err => next(err))
}

exports.getSorted = (req, res, next) => {
	service.getSorted()
	.then(lists => res.json(lists))
	.then(err => next(err))
}

exports.vote = (req, res, next) => {
	service.vote(req.body)
	.then(lists => res.json(lists))
	.then(err => next(err))
}

exports.search = (req, res, next) => {
	service.search(req.body)
	.then(lists => res.json(lists))
	.then(err => next(err))
}