import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEventDto } from 'src/events/dtos/create-event.dto';
import { UpdateEventDto } from 'src/events/dtos/update-event.dto';
import { Event } from 'src/events/entities/events.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EventsService implements OnModuleInit {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  async onModuleInit(): Promise<void> {
    // await this.checkStatusOfEvents();
  }

  async getEvents(): Promise<Event[]> {
    return await this.eventRepository.find();
  }

  async getEvent(id: string): Promise<Event> {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) throw new BadRequestException('Event Not Found.');
    return event;
  }

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);
    return await this.eventRepository.save(event);
  }

  async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
  ): Promise<Event[]> {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) throw new BadRequestException('Event not found.');
    await this.eventRepository.update({ id }, updateEventDto);
    return await this.getEvents();
  }

  async deleteEvent(id: string): Promise<Event[]> {
    const event = await this.eventRepository.findOneBy({ id });
    if (!event) throw new BadRequestException('Event not found.');
    await this.eventRepository.delete({ id });
    return await this.getEvents();
  }

  public checkStatusOfEvents = async (): Promise<void> => {
    const events = await this.eventRepository.find();

    for (const event of events) {
      const today = new Date();
      await this.eventRepository.update(
        {
          id: event.id,
        },
        {
          status:
            event.start_date.getTime() <= today.getTime() &&
            today.getTime() <= event.end_date.getTime()
              ? 'ongoing'
              : today.getTime() < event.start_date.getTime()
                ? 'scheduled'
                : 'finished',
        },
      );
    }
  };
}
