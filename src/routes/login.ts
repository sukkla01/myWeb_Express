/// <reference path="../../typings.d.ts" />

import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';
import * as crypto from 'crypto';

import { Login } from '../models/login';

import { Jwt } from '../models/jwt';

const loginModel = new Login();
const jwt = new Jwt();

const router: Router = Router();

router.post('/', async (req: Request, res: Response) => {
  let db = req.db;
  let username: string = req.body.username;
  let password: string = req.body.password;
  let typeId: string = req.body.typeId;

  let encPassword = crypto
    .createHash('md5')
    .update(password)
    .digest('hex');
  let token = null;
  let isError = false;

  if (typeId == '1') {
    let rs: any = await loginModel.doTechnicianLogin(db, username, encPassword);
    if (rs.length) {
      let payload: any = {};
      payload.id = rs[0].technician_id;
      payload.firstName = rs[0].first_name + ' ' + rs[0].last_name;
      payload.usertype = 'admin';

      token = jwt.sign(payload);
    } else {
      isError = true;
    }
  } else {
    let rs: any = await loginModel.doCustomerLogin(db, username, encPassword);
    if (rs.length) {
      let payload: any = {};
      payload.id = rs[0].customer_id;
      payload.firstName = rs[0].first_name + ' ' + rs[0].last_name;
      payload.usertype = 'staff';

      token = jwt.sign(payload);
    } else {
      isError = true;
    }
  }


  if (isError) {
    res.send({ ok: false, error: 'ชื่อผู้ใช้งาน รหัสผ่าน ไม่ถูกต้อง' })
  } else {
    res.send({ ok: true, token: token });
  }


});


router.post('/customer', async (req: Request, res: Response) => {
  let username: string = req.body.username;
  let password: string = req.body.password;

  let db = req.db;

  try {
    let encPassword = crypto.createHash('md5').update(password).digest('hex');
    let rs: any = await loginModel.doCustomerLogin(db, username, encPassword);

    if (rs.length) {

      let payload = {
        fullname: `${rs[0].first_name} ${rs[0].last_name}`,
        id: rs[0].customer_id,
        uertype: 'staff'
      }

      let token = jwt.sign(payload);
      res.send({ ok: true, token: token, code: HttpStatus.OK });
    } else {
      res.send({ ok: false, error: 'Login failed!', code: HttpStatus.UNAUTHORIZED });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }

});

router.post('/technician', async (req: Request, res: Response) => {
  let username: string = req.body.username;
  let password: string = req.body.password;

  let db = req.db;

  try {
    let encPassword = crypto.createHash('md5').update(password).digest('hex');
    let rs: any = await loginModel.doTechnicianLogin(db, username, encPassword);

    if (rs.length) {

      let payload = {
        fullname: rs[0].fullname,
        username: username,
        uertype: 'admin'
      }

      let token = jwt.sign(payload);
      res.send({ ok: true, token: token, code: HttpStatus.OK });
    } else {
      res.send({ ok: false, error: 'Login failed!', code: HttpStatus.UNAUTHORIZED });
    }
  } catch (error) {
    res.send({ ok: false, error: error.message, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }

});

export default router;