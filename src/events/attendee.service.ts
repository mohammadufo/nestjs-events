import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee } from './attendee.entitiy';
import { Repository } from 'typeorm';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectRepository(Attendee) private attendeeRepo: Repository<Attendee>,
  ) {}

  public async findByEventId(id: number): Promise<Attendee[]> {
    return await this.attendeeRepo.findBy({ eventId: id });
  }
}
