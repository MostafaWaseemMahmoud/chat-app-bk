import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.contoller';
import { RoomsService } from './rooms.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './rooms.schema';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: User.name, schema: UserSchema }, // ✅ FIXED
    ]),
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}
