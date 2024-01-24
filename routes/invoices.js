/* Company Routes */

const express = require('express');
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query('SELECT id, comp_code FROM invoices');
        return res.json({invoices: results.rows})
    } catch (e){
        return next(e)
    };
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params.id;
        const results = await db.query('SELECT i.id, i.amt, i.paid, i.add_date, i.paid_date, c.name, c.description FROM invoices AS i INNER JOIN companies AS c ON (i.comp_code = c.code) WHERE id =$1', [id]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        return res.json({"invoice": results.rows[0]})
    } catch (e){
        return next(e)
    };
});

router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date', [comp_code, amt]);
        return res.status(201).json({"invoice": results.rows[0]})
    } catch(e) {
        return next(e)
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;
        const results = await db.query('UPDATE invoices SET amt=$1 WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date', [amt, id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404)
        }
        return res.json({"invoice": results.rows[0]})
    } catch(e) {
        return next(e)
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const results = db.query('DELETE FROM invoices WHERE id = $1', [req.params.id])
        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoices with code of ${id}`, 404)
        }
        return res.send({ "status": "DELETED" })
    } catch(e) {
        return next(e)
    }
})

