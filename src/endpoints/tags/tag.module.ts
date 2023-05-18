import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common/database/database.module';
import { TagsService } from './tag.service';

@Module({
  imports: [DatabaseModule],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
