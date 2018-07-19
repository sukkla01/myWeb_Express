import * as express from 'express';
import { Router, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send({ ok: true, message: 'Welcome to RESTful api server!', code: HttpStatus.OK });
});

router.get('/hello/:name/:age', (req: Request, res: Response) => {
  //http://localhost:3000/hello/sujin/33
  let name = req.params.name;
  let age = req.params.age;
  res.send({ name: name, age: age });
});

router.get('/hello', (req: Request, res: Response) => {
  //http://localhost:3000/hello?name=test&age=33
  let name = req.query.name;//รับค่าตัวแปลจาก url
  let age = req.query.age;//รับค่าตัวแปลจาก url
  res.send({ name: name, age: age });
});

// create ข้อมูล
router.post('/hello', (req: Request, res: Response) => {
  let name = req.body.name;
  let age = req.body.age;
  res.send({ name: name, age: age });
});

//update ข้อมูล
router.put('/hello', (req: Request, res: Response) => {
  let name = req.body.name;
  let age = req.body.age;
  res.send({ name: name, age: age });
});

//ลบ ข้อมูล
router.delete('/hello', (req: Request, res: Response) => {
  let name = req.body.name;
  let age = req.body.age;
  res.send({ name: name, age: age });
});






export default router;