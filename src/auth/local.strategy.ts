import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {
    super();
  }

  public async validate(username: string, password: string): Promise<any> {
    const user = await this.userRepo.findOneBy({ username });

    if (!user) {
      this.logger.debug(`User ${username} not found!`);
      throw new UnauthorizedException('Wrong UserName or password!');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.debug(`Invalid credentials for ${username}!`);
      throw new UnauthorizedException('Wrong UserName or password!');
    }

    return user;
  }
}
