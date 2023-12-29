import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Logger,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { WhenEventFilterDto } from './dto/list-events-filter.dto';

@Controller('events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  findAll(@Query() filter: WhenEventFilterDto) {
    this.logger.debug('filter', filter);
    this.logger.verbose('hi from find all 👋🏻');
    return this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        currentPage: filter.page,
        limit: filter.limit,
      },
    );
  }

  @Get('practice')
  practice() {
    return this.eventsService.practice();
  }

  @Get('practice2')
  practice2() {
    return this.eventsService.practice2();
  }

  @Get('practice3')
  practice3() {
    return this.eventsService.practice3();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.getEvent(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
