import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { Attendee } from './attendee.entitiy';
import { AttendeeService } from './attendee.service';

@Controller('events/attendee/:eventId')
@SerializeOptions({ strategy: 'excludeAll' })
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId') eventId: number): Promise<Attendee[]> {
    return this.attendeeService.findByEventId(eventId);
  }
}
