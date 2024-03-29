import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DeleteResult, Like, MoreThan, Repository } from 'typeorm';
import { Event, PaginatedEvent } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendee, AttendeeAnswerEnum } from 'src/events/attendee.entitiy';
import {
  WhenEventFilterDto,
  WhenEventFilterEnum,
} from './dto/list-events-filter.dto';
import { PaginateOptions, paginate } from 'src/utils/paginator';
import { User } from 'src/auth/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private repo: Repository<Event>,
    @InjectRepository(Attendee) private repoAttendee: Repository<Attendee>,
  ) {}

  private readonly logger = new Logger(EventsService.name);

  async create(createEventDto: CreateEventDto, user: User): Promise<Event> {
    //! have ugly error!
    // return this.repo.save({
    //   ...createEventDto,
    //   organizer: user,
    //   when: new Date(createEventDto.when),
    // });

    const event = this.repo.create(createEventDto);
    event.organizer = user;

    await this.repo.save(event);

    return event;
  }

  findAll() {
    return this.repo.find();
  }

  private getEventsWithAttendeeCountFiltered(filter?: WhenEventFilterDto) {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      query;
    }

    if (filter.when) {
      if (+filter.when === WhenEventFilterEnum.Today) {
        query = query.andWhere(
          `e.when >= CURRENT_DATE AND e.when < CURRENT_DATE + INTERVAL '1 day'`,
        );
      }

      if (+filter.when === WhenEventFilterEnum.Tomorrow) {
        query = query.andWhere(
          `e.when >= CURRENT_DATE + INTERVAL '1 day' AND e.when < CURRENT_DATE + INTERVAL '2 days'`,
        );
      }

      if (+filter.when === WhenEventFilterEnum.ThisWeek) {
        query = query.andWhere(
          'EXTRACT(YEAR FROM e.when) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(WEEK FROM e.when) = EXTRACT(WEEK FROM CURRENT_DATE)',
        );
      }

      if (+filter.when === WhenEventFilterEnum.NextWeek) {
        query = query.andWhere(
          'EXTRACT(YEAR FROM e.when) = EXTRACT(YEAR FROM CURRENT_DATE) AND EXTRACT(WEEK FROM e.when) = EXTRACT(WEEK FROM CURRENT_DATE) + 1',
        );
      }
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: WhenEventFilterDto,
    paginateOptions: PaginateOptions,
  ) {
    return await paginate(
      this.getEventsWithAttendeeCountFiltered(filter),
      paginateOptions,
    );
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

  practice2() {
    return this.repo.findOne({
      where: { id: '1' },
      relations: ['attendees'],
    });
  }

  async practice3() {
    const event = await this.repo.findOne({
      where: { id: '1' },
      relations: ['attendees'],
    });

    // const attendee = new Attendee();
    // attendee.name = 'using cascade';

    // event.attendees.push(attendee);

    // await this.repo.save(event);

    const attendeeData = {
      name: 'mamad ufo',
    };

    const attendee = this.repoAttendee.create(attendeeData);
    attendee.event = event;
    await this.repoAttendee.save(attendee);

    return event;
  }

  getEventBaseQuery() {
    return this.repo.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeeCountQuery().andWhere(
      'e.id = :id',
      { id },
    );

    this.logger.debug(query.getSql());

    //* with relations!
    // return this.repo.findOne({
    //   where: { id },
    //   relations: {
    //     organizer: true,
    //   },
    // });

    return await query.getOne();
  }

  public getEventsWithAttendeeCountQuery() {
    return this.getEventBaseQuery()
      .loadRelationCountAndMap('e.attendeeCount', 'e.attendees')
      .loadRelationCountAndMap(
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Accepted,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.answer = :answer', {
            answer: AttendeeAnswerEnum.Rejected,
          }),
      );
  }

  findOne(id: string) {
    // const event = this.repo.findOne({
    //   where: { id },
    // });

    const event = this.repo.findOneBy({ id });

    if (!event) {
      throw new NotFoundException('event not found!');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: User) {
    const event = await this.repo.findOne({ where: { id } });

    if (!event) throw new NotFoundException('event not exist with this id!');

    if (event.organizerId !== user.id) {
      throw new ForbiddenException('You can change only your event!');
    }

    Object.assign(event, updateEventDto);

    return this.repo.save(event);
  }

  async remove(id: string, user: User) {
    const event = await this.repo.findOne({
      where: { id },
    });

    if (event.organizerId !== user.id) {
      throw new ForbiddenException('You can change only your event!');
    }

    return this.repo.remove(event);
  }

  public async deleteEvent(id: number, user: User): Promise<DeleteResult> {
    const event = await this.repo.findOne({
      where: { id: id.toString() },
    });

    if (event.organizerId !== user.id) {
      throw new ForbiddenException('You can change only your event!');
    }

    return await this.repo
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  public async getEventsOrganizedByUserIdQueryPaginated(
    userId: number,
    PaginateOptions: PaginateOptions,
  ): Promise<PaginatedEvent> {
    return await paginate<Event>(
      this.getEventsOrganizedByUserIdQuery(userId),
      PaginateOptions,
    );
  }

  private getEventsOrganizedByUserIdQuery(userId: number) {
    return this.getEventBaseQuery().where('e.organizerId = :userId', {
      userId,
    });
  }
}
