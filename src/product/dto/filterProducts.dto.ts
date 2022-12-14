import { ApiProperty } from '@nestjs/swagger';
import * as joi from 'joi';
import { SortOrder } from 'src/core/interface';

export class FilterProductsDTO {
    @ApiProperty({ description: 'Name', required: false, example: 'The Death', nullable: true })
    name: string;

    @ApiProperty({ description: 'Min price', required: false, example: '0', nullable: true })
    minPrice: number;

    @ApiProperty({ description: 'Max price', required: false, example: '100', nullable: true })
    maxPrice: number;

    @ApiProperty({ description: 'categories', example: ['12', '23'], isArray: true, required: false, nullable: true })
    categories: string[];

    @ApiProperty({ description: 'is Sale', required: false, example: true, nullable: true })
    isSale: boolean;

    @ApiProperty({ description: 'current page', example: '0', nullable: true })
    currentPage: number;

    @ApiProperty({ description: 'page size', example: '12', nullable: true })
    pageSize: number;

    @ApiProperty({ description: 'Sort by', example: 'ASC', nullable: true })
    order: SortOrder;
}

export const vFilterProductsDTO = joi.object<FilterProductsDTO>({
    name: joi.string().required().failover(''),
    minPrice: joi.number().required().failover(0),
    maxPrice: joi.number().required().failover(999999),
    categories: joi.alternatives().required().failover([]).try(joi.array().items(joi.string()).failover([]), joi.string().failover(null)),
    isSale: joi.boolean().required().failover(null),
    currentPage: joi.number().required().failover(0),
    pageSize: joi.number().required().failover(12),
    order: joi.string().valid('ASC', 'DESC').required().failover('ASC'),
});
