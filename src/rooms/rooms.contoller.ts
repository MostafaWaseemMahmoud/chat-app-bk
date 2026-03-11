import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { RoomsService } from "./rooms.service";

@Controller('rooms')
export class RoomsController {

  constructor(private readonly roomService: RoomsService) {}

  @Get('/')
  sayHi() {
    return { message: "Rooms Root Is Success" };
  }

  @Post("createroom")
  createRoom(@Body() body) {
    return this.roomService.create_room(body);
  }

  @Get("allrooms/:id")
  findUsersRoom(@Param('id') id: string) {
    return this.roomService.getUsersRooms(id);
  }

  @Post("sendmessage/:roomid/:userid")
  sendMessage(
    @Param('roomid') roomid: string,
    @Param('userid') userid: string,
    @Body("message") message: string,
    @Body("email") email: string,
    @Body("date") date: string
  ) {
    return this.roomService.sendMessage(roomid, message, email, userid, date);
  }

  @Post("makeasread/:roomid/:userid")
  makeAsRead(
    @Param('roomid') roomid: string,
    @Param('userid') userid: string
  ) {
    return this.roomService.moveNewMessagesToMessages(roomid, userid);
  }
}