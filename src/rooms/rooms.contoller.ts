import { Body, Controller, Get, Param, Post, Req, Res } from "@nestjs/common";
import { RoomsService } from "./rooms.service";

@Controller('rooms')

export class RoomsController {
      constructor(private readonly  roomService: RoomsService) {}
    
       @Get('/') 

       sayHi(@Res() res) {
            res.status(200).json({message: "Rooms Root Is Success"})
       }

       @Post("createroom")

       CreateRoom(@Req() req, @Res() res){
        return this.roomService.create_room(req,res)
       }

       @Get("allrooms/:id")

       FindUsersRoom(@Param('id') id, @Res() res){
        return this.roomService.getUsersRooms(res,id)
       }

       @Post("sendmessage/:rooomid/:userid")

       sendMessage(@Param('rooomid') roomid,@Param('userid') userid, @Res() res,@Body("message") message,@Body("email") email,@Body("date") date){
        return this.roomService.sendMessage(res,roomid,message,email,userid,date);
       }

       @Post("makeasread/:rooomid/:userid")

       MakeAsRead(@Param('rooomid') roomid,@Param('userid') userid,@Res() res){
        return this.roomService.moveNewMessagesToMessages(res,roomid,userid);
       }
}
