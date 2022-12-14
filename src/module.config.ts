import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './core';
import { User } from './core/models';
import { Address } from './core/models/address';
import { Product } from './core/models/product';
import { ProductCategory } from './core/models/product-category';

export const DbModule = TypeOrmModule.forRoot({
    type: 'mysql',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    synchronize: true,
    keepConnectionAlive: true,
    entities: [User, Address, ProductCategory, Product],
    extra: { connectionLimit: 1 },
});
