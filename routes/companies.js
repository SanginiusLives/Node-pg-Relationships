/* Company Routes */

const express = require('express');
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query('SELECT code, name FROM companies');
        return res.json({companies: results.rows})
    } catch (e){
        return next(e)
    };
});

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query('SELECT code, name, description FROM companies WHERE code = $1', [code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find user with code of ${code}`, 404)
        }
        return res.json({"compnay": results.rows[0]})
    } catch (e){
        return next(e)
    };
});

router.post('/', async (req, res, next) => {
    try {
        const { name, description } = req.body;
        let code = slugify(name, {lower: true});
        const results = await db.query('INSERT INTO companies (code, name, type) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({"company": results.rows[0]})
    } catch(e) {
        return next(e)
    }
});

router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, type', [name, description, code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find user with code of ${code}`, 404)
        }
        return res.json({"company": results.rows[0]})
    } catch(e) {
        return next(e)
    }
});

router.delete('/:code', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM companies WHERE code = $1', [req.params.code])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find user with code of ${code}`, 404)
        }
        return res.send({ "status": "DELETED" })
    } catch(e) {
        return next(e)
    }
})

