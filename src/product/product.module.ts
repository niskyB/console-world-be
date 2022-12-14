import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from 'src/core/repositories/product.repository';
import { Connection } from 'typeorm';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ProductCategoryModule } from 'src/product-category/product-category.module';
import { ProductsController } from './products.controller';

@Module({
    imports: [forwardRef(() => AuthModule), forwardRef(() => UserModule), FirebaseModule, ProductCategoryModule],
    controllers: [ProductController, ProductsController],
    providers: [ProductService, { provide: ProductRepository, useFactory: (connection: Connection) => connection.getCustomRepository(ProductRepository), inject: [Connection] }],
})
export class ProductModule {}
