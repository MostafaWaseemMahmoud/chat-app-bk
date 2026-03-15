import { UsersModule } from './../users/users.module';
import { Injectable, ConflictException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Room } from './rooms.schema';
import { User } from 'src/users/user.schema';

@Injectable()

export class RoomsService {
    constructor(@InjectModel(Room.name) private roomsModel: Model<Room>,@InjectModel(User.name) private UsersModule: Model<User>) {}
    
        generateCode(length: number = 6): string {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          let result = '';
        
          for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
        
          return result;
        }


        async create_room(req,res) {
            try {
                const code = this.generateCode();
                const Room = await this.roomsModel.create({
                    userId: req.body.userId,
                    otherUserId: req.body.friendId,
                    Messages: [],
                    NewMessages: [],
                    RoomId: code,
                })

                const FriendRoom = await this.roomsModel.create({
                    userId: req.body.friendId,
                    otherUserId: req.body.userId,
                    Messages: [],
                    NewMessages: [],
                    RoomId: code,
                })

                    return res.status(201).json({message: "Room created succ",Room: Room,FriendRoom: FriendRoom});


                
            } catch (error) {
                return res.status(500).json({message: "Error While Creating Room", error:error})
            }
        }
        
        
async getUsersRooms(res, id) {
  try {
    const allRooms = await this.roomsModel.find({ userId: id }).exec();
    return res.status(200).json(allRooms);
} catch (error) {
    return res.status(500).json({
      message: 'Error While Fetching Rooms',
      error,
    });
}
}


async sendMessage(res, roomId: string, message: string, email: string, userid,date) {
  try {
    const allRooms = await this.roomsModel.find({ RoomId: roomId }).exec();

    if (allRooms.length === 0) {
      return res.status(404).json({ message: 'No Room With This Id' });
    }

    for (const room of allRooms) {
        if(room.userId === userid){
            room.Messages.push({
              sender_email: email,
              message: message,
              date:date
            });
      
            await room.save(); // ✅ THIS IS IMPORTANT
        }else {
            room.NewMessages.push({
              sender_email: email,
              message: message,
              date:date
            });
      
            await room.save(); // ✅ THIS IS IMPORTANT
        }
    }

    return res.status(200).json({ message: 'Message sent successfully' , allRooms:allRooms});

  } catch (error) {
    return res.status(500).json({
      message: 'Error while sending message',
      error,
    });
  }
}

async moveNewMessagesToMessages(res, roomId: string, userId: string) {
  try {
    const room = await this.roomsModel.findOne({
      RoomId: roomId,
      userId: userId,
    });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.NewMessages.length > 0) {
      return res.status(200).json({ message: 'No new messages' });
    }

    // ✅ Move messages
    room.Messages.push(...room.NewMessages);
    room.NewMessages = [];

    await room.save();

    return res.status(200).json({
      message: 'Messages moved successfully',
      messages: room.Messages,
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error while moving messages',
      error,
    });
  }
}
}