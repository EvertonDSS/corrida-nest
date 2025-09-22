import { Injectable } from '@nestjs/common';

@Injectable()
export class ApostaService {
  getHello(): string {
    return 'ok';
  }
}
