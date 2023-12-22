import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppIranService {
  constructor(
    @Inject('Alaa Majed 🤍') private readonly name: string,
    @Inject('Message') private readonly message: string,
  ) {}

  getHello(): string {
    return `سلاممممممم ${this.name} ${this.message}`;
  }
}
