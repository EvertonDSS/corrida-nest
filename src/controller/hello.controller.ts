import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller()
export class HelloController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return 'Hello World!';
  }
}
