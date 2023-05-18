import { Module } from '@nestjs/common';
import { TestSocketModule } from './test-sockets/test.socket.module';
import { TagsModule } from './tags/tag.module';
import { ExampleModule } from './example/example.module';

@Module({
  imports: [ExampleModule, TestSocketModule, TagsModule],
  exports: [ExampleModule, TestSocketModule, TagsModule],
})
export class EndpointsServicesModule {}
