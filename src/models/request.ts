import * as Knex from 'knex';

export class RequestModel {

  saveRequest(db: Knex, data: any) {
    return db('requests')
      .insert(data);
  }

  delRequest(db: Knex, requestId: any) {
    console.log(requestId);
    return db('requests')
      .where('request_id', requestId)
      .del();
  }

  getDetail(db: Knex, requestId: any) {
    console.log(requestId);
    return db('requests')
      .where('request_id', requestId)

  }




  getlist(db: Knex, customerId: any, limit: number, offset: number) {
    return db('requests as r')
      .select('r.*', 'rc.request_category_name')
      .where('r.customer_id', customerId)
      .leftJoin('request_categories as rc', 'rc.request_category_id', 'r.request_category_id')
      .limit(limit)
      .offset(offset)
      .orderBy('r.request_date');

  }


  getTotal(db: Knex, customerId: any) {
    return db('requests').where('customer_id', customerId)
      .select(db.raw('count(*) as total'));
  }

  getRequestLog(db: Knex, requestId: any) {
    let sql = `
    select l.*, t.first_name, t.last_name
    from request_logs as l
    inner join technicians as t on t.technician_id=l.technician_id
    where l.request_id=?
    `;

    return db.raw(sql, [requestId]);


  }

}