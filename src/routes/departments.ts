/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import { DepartmentModel } from '../models/department';

const DepartmentModels = new DepartmentModel;
const router: Router = Router();

/*router.get('/', (req: Request, res: Response) => {
    let db = req.db;

    db('departments')
        .then(rows => {
            res.send({ ok: true, rows: rows })
        })
        .catch(error => {
            console.log(error);
            res.send({ ok: true, error: error.message })
        });

});*/

router.get('/', async (req: Request, res: Response) => {
    let db = req.db;
    try {
        //let rows = await db('departments');
        //let rows = await db('departments').orderBy('department_name');
        //let sql = 'select * from departments';
        //let rows = await db.raw(sql);
        //res.send({ ok: true, rows: rows })
        let rows = await DepartmentModels.getlist(db);
        res.send({ ok: true, rows: rows[0] }) //กรณี select
    } catch (error) {
        console.log(error);
        res.send({ ok: false, error: error.message })
    }


});

router.post('/', async (req: Request, res: Response) => {
    let db = req.db;
    let departmentName = req.body.departmentName;
    try {
        let data: any = {};
        data.department_name = departmentName
        await DepartmentModels.save(db, data);
        res.send({ ok: true })
    } catch (error) {
        console.log(error);
        res.send({ ok: false, error: error.message })
    }


});
router.put('/:departmentId', async (req: Request, res: Response) => {
    let db = req.db;
    let departmentId = req.params.departmentId;
    let departmentName = req.body.departmentName;
    try {

        await DepartmentModels.update(db, departmentId, departmentName);
        res.send({ ok: true }) //กรณี select
    } catch (error) {
        console.log(error);
        res.send({ ok: false, error: error.message })
    }


});

router.delete('/:departmentId', async (req: Request, res: Response) => {
    let db = req.db;
    let departmentId = req.params.departmentId;
    try {

        await DepartmentModels.delete(db, departmentId);
        res.send({ ok: true }) //กรณี select
    } catch (error) {
        console.log(error);
        res.send({ ok: false, error: error.message })
    }


});



export default router;