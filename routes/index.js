const express = require('express');
const router = require('express').Router();
const routerUsers = require('./users');
const routerCards = require('./cards');

const { NOT_FOUND_ERROR } = require('../errors/errors');

router.use(routerUsers);
router.use(routerCards);

router.use('*', (req, res, next) => {
    next(res.status(NOT_FOUND_ERROR).send({ message: 'Передан некорректный путь' }));
});

module.exports = router;