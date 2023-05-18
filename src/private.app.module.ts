import { Module } from '@nestjs/common';
import { CacheController } from './endpoints/caching/cache.controller';
import { ApiMetricsController } from './common/metrics/api.metrics.controller';
import { DynamicModuleUtils } from './utils/dynamic.module.utils';
import { ApiMetricsModule } from './common/metrics/api.metrics.module';
import { LoggingModule } from '@multiversx/sdk-nestjs-common';

@Module({
  imports: [
    LoggingModule,
    ApiMetricsModule,
    DynamicModuleUtils.getCachingModule(),
  ],
  providers: [
    DynamicModuleUtils.getNestJsApiConfigService(),
    DynamicModuleUtils.getPubSubService(),
  ],
  controllers: [ApiMetricsController, CacheController],
})
export class PrivateAppModule {}
