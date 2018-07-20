/// <reference path="../../typings.d.ts" />

import * as HttpStatus from 'http-status-codes';
import * as moment from 'moment';

import * as express from 'express';
import { Router, Request, Response } from 'express';

import { RequestModel } from '../models/request';

const requestModel = new RequestModel();
const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {

  let db = req.db;
  let customerId = req.decoded.id; //จาก token
  let limit = +req.query.limit || 10;
  let offset = +req.query.offset || 0;
  try {

    let rs: any = await requestModel.getlist(db, customerId, limit, offset);
    let rsTotal: any = await requestModel.getTotal(db, customerId);

    res.send({ ok: true, rows: rs, total: rsTotal[0].total })
  } catch (error) {
    res.send({ ok: false, error: error.message });
  }

  router.get('/logs/:requestId', async (req: Request, res: Response) => {
    let db = req.db;
    let requestId = req.params.requestId;

    try {
      let rs: any = await requestModel.getRequestLog(db, requestId);
      res.send({ ok: true, rows: rs[0] });
    } catch (error) {
      res.send({ ok: false, error: error.message });
    }

  });



});
//delete
router.delete('/:requestId', async (req: Request, res: Response) => {
  let db = req.db;
  let requestId = req.params.requestId;

  try {
    await requestModel.delRequest(db, requestId);
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false });
  }

});

//getDetail
router.get('/:requestId', async (req: Request, res: Response) => {
  let db = req.db;
  let requestId = req.params.requestId;

  try {
    let rs: any = await requestModel.getDetail(db, requestId);
    res.send({ ok: true, info: rs[0] });
  } catch (error) {
    res.send({ ok: false, error: error.message });
  }

});





// save new request
router.post('/', async (req: Request, res: Response) => {
  let code = moment().format('x');
  let cause = req.body.cause;
  let categoryId = req.body.categoryId;
  let remark = req.body.remark;
  let customerId = req.decoded.id;
  let requestDate = moment().format('YYYY-MM-DD');//วันที่ปัจจุบัน
  let requestTime = moment().format('HH:mm:ss');//เวลาปัจจุบัน

  let data: any = {};
  data.request_code = code;
  data.request_cause = cause;
  data.customer_id = customerId;
  data.request_date = requestDate;
  data.request_time = requestTime;
  data.request_category_id = categoryId;
  data.remark = remark;

  try {
    await requestModel.saveRequest(req.db, data);
    res.send({ ok: true, code: HttpStatus.OK });
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.OK });
  }

});

export default router;