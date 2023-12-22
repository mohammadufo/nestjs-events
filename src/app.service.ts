import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(
    @Inject('Alaa Majed 🤍') private readonly name: string,
    @Inject('MESSAGE') private readonly message: string,
  ) {}

  getHello(): string {
    return `Hello World! ${this.name} ${this.message}`;
  }
}
