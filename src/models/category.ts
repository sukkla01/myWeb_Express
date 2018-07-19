import * as knex from 'knex';

export class CategoryModel {
    getlist(db: knex) {
        return db('request_categories').orderBy('request_category_id', 'DESC');
    }
}