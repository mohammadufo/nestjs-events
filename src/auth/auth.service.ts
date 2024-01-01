import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDro } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  public getTokenForUser(user: User): string {
    return this.jwtService.sign({
      username: user.username,
      sub: user.id,
    });
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  public async create(body: CreateUserDro) {
    if (body.password !== body.confirmPassword) {
      this.logger.debug('password dose not match!');
      throw new BadRequestException('passwords dose not match!');
    }

    const existUser = await this.userRepo.findOne({
      where: [{ username: body.username }, { email: body.email }],
    });

    if (existUser) {
      throw new BadRequestException('username or email is already exist!');
    }

    const user = this.userRepo.create(body);
    const hashedPassword = await this.hashPassword(user.password);
    user.password = hashedPassword;

    return {
      ...(await this.userRepo.save(user)),
      token: this.getTokenForUser(user),
    };
  }
}
