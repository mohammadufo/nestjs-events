import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Like, MoreThan, Repository } from 'typeorm';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventsService {
  constructor(@InjectRepository(Event) private repo: Repository<Event>) {}

  create(createEventDto: CreateEventDto) {
    const event = this.repo.create(createEventDto);

    return this.repo.save(event);
  }

  findAll() {
    return this.repo.find();
  }

  practice() {
    return this.repo.find({
      select: ['id', 'when', 'name'],
      where: [
        {
          id: MoreThan('3'),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }

  findOne(id: string) {
    return this.repo.findOne({
      where: { id },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.repo.findOne({ where: { id } });

    if (!event) throw new NotFoundException('event not exist with this id!');

    Object.assign(event, updateEventDto);

    return this.repo.save(event);
  }

  async remove(id: string) {
    const event = await this.repo.findOne({ where: { id } });

    return this.repo.remove(event);
  }
}
