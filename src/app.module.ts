import { Module } from '@nestjs/common';
import * as Controllers from './controller';
import * as Services from './services';

@Module({
  imports: [],
  controllers: Object.values(Controllers),
  providers: Object.values(Services),
})
export class AppModule {}
