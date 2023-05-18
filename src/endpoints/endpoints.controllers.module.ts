import { Module } from '@nestjs/common';
import { DynamicModuleUtils } from 'src/utils/dynamic.module.utils';
import { AuthController } from './auth/auth.controller';
import { EndpointsServicesModule } from './endpoints.services.module';
import { TagsController } from './tags/tag.controller';

@Module({
  imports: [EndpointsServicesModule],
  providers: [DynamicModuleUtils.getNestJsApiConfigService()],
  controllers: [AuthController, TagsController],
})
export class EndpointsControllersModule {}
