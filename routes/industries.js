/* Industry Routes */

const express = require('express');
const ExpressError = require("../expressError");
const db = require("../db");

let router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query('SELECT i.industry, c.code FROM industries AS i INNER JOIN companies AS c ON (i.code = c.industry_code)');
        return res.json({industries: results.rows})
    } catch (e){
        return next(e)
    };
});

router.post('/', async (req, res, next) => {
    try {
        const { industry } = req.body;
        const results = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry', [code, industry]);
        return res.status(201).json({"industry": results.rows[0]})
    } catch(e) {
        return next(e)
    }
});

router.post('/:industryCode/companies/:companyCode', async (req, res, next) => {
    try {
        const { industryCode, companyCode } = req.params;
        
        // Check if both industry and company exist
        const industryResult = await db.query('SELECT * FROM industries WHERE code = $1', [industryCode]);
        const companyResult = await db.query('SELECT * FROM companies WHERE code = $1', [companyCode]);

        if (industryResult.rows.length === 0) {
            throw new ExpressError(`Industry with code ${industryCode} not found`, 404);
        }

        if (companyResult.rows.length === 0) {
            throw new ExpressError(`Company with code ${companyCode} not found`, 404);
        }

        // Update the company's industry association
        await db.query('UPDATE companies SET industry_code = $1 WHERE code = $2', [industryCode, companyCode]);

        return res.json({"message": `Company ${companyCode} associated with industry ${industryCode}`});
    } catch (e) {
        return next(e);
    }
});


