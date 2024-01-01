import { Attendee } from 'src/attendee.entitiy';
import { User } from 'src/auth/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    nullable: false,
    // eager: true,
    cascade: true,
    // cascade: ['insert', 'update'],
  })
  attendees: Attendee[];

  @ManyToOne(() => User, (user) => user.organized)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  attendeeCount?: number;
  attendeeRejected?: number;
  attendeeMaybe?: number;
  attendeeAccepted?: number;
}
