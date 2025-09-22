import { Controller, Get } from '@nestjs/common';
import { ApostaService } from '../services/aposta.service';

@Controller('/aposta')
export class ApostaController {
  constructor(private readonly apostaService: ApostaService) {}

  @Get()
  getHello(): string {
    return this.apostaService.getHello();
  }
}