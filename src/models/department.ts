import * as knex from 'knex';

export class DepartmentModel {
    getlist(db: knex) {
        return db('departments').orderBy('department_name', 'DESC');
    }

    save(db: knex, data: any) {
        return db('departments').insert(data);

    }
    update(db: knex, departmentId: any, departmentName: any) {
        return db('departments')
            .where('department_id', departmentId)
            .update({ department_name: departmentName });

    }


    delete(db: knex, departmentId: any) {
        return db('departments')
            .where('department_id',departmentId)
            .del();
    }

   
}