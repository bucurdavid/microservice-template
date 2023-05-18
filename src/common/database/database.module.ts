import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiConfigService } from '../api-config/api.config.service';
import { Tag } from 'src/endpoints/tags/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: (apiConfigService: ApiConfigService) => ({
        type: 'mysql',
        ...apiConfigService.getDatabaseConnection(),
        entities: [Tag], // Add the Tag entity here
        keepConnectionAlive: true,
        synchronize: true,
      }),
      inject: [ApiConfigService],
    }),
    TypeOrmModule.forFeature([Tag]), // Add the Tag entity here as well
  ],
  exports: [
    TypeOrmModule.forFeature([Tag]), // Export the Tag entity as well
  ],
})
export class DatabaseModule {}
