import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './rooms.schema';
import { User } from 'src/users/user.schema';

@Injectable()
export class RoomsService {

  constructor(
    @InjectModel(Room.name) private roomsModel: Model<Room>,
    @InjectModel(User.name) private usersModel: Model<User>
  ) {}

  generateCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
  }

  async create_room(body) {
    try {

      const code = this.generateCode();

      const room = await this.roomsModel.create({
        userId: body.userId,
        otherUserId: body.friendId,
        Messages: [],
        NewMessages: [],
        RoomId: code,
      });

      const friendRoom = await this.roomsModel.create({
        userId: body.friendId,
        otherUserId: body.userId,
        Messages: [],
        NewMessages: [],
        RoomId: code,
      });

      return {
        message: "Room created successfully",
        room,
        friendRoom
      };

    } catch (error) {
      throw new HttpException(
        { message: "Error While Creating Room", error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUsersRooms(id: string) {
    try {

      const allRooms = await this.roomsModel.find({ userId: id }).exec();

      return allRooms;

    } catch (error) {
      throw new HttpException(
        { message: "Error While Fetching Rooms", error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sendMessage(roomId: string, message: string, email: string, userid: string, date: string) {
    try {

      const allRooms = await this.roomsModel.find({ RoomId: roomId });

      if (!allRooms || allRooms.length === 0) {
        throw new HttpException("No Room With This Id", HttpStatus.NOT_FOUND);
      }

      for (const room of allRooms) {

        if (room.userId === userid) {

          room.Messages.push({
            sender_email: email,
            message: message,
            date: date
          });

        } else {

          room.NewMessages.push({
            sender_email: email,
            message: message,
            date: date
          });

        }

        await room.save();
      }

      return {
        message: "Message sent successfully",
        rooms: allRooms
      };

    } catch (error) {
      throw new HttpException(
        { message: "Error while sending message", error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async moveNewMessagesToMessages(roomId: string, userId: string) {
    try {

      const room = await this.roomsModel.findOne({
        RoomId: roomId,
        userId: userId
      });

      if (!room) {
        throw new HttpException("Room not found", HttpStatus.NOT_FOUND);
      }

      if (!room.NewMessages || room.NewMessages.length === 0) {
        return { message: "No new messages" };
      }

      room.Messages.push(...room.NewMessages);
      room.NewMessages = [];

      await room.save();

      return {
        message: "Messages moved successfully",
        messages: room.Messages
      };

    } catch (error) {
      throw new HttpException(
        { message: "Error while moving messages", error },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}