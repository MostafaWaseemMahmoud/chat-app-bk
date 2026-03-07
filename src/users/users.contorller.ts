import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

/* ================= Cloudinary Config ================= */
cloudinary.config({
       cloud_name: 'dzxczwjs5', 
        api_key: '445662215379273', 
        api_secret: 'CZ6FUSId3nHqCylMED1A7WalSRI' 
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async () => ({
    folder: 'avatars',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  }),
});

/* ================= Controller ================= */
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.sayHelloUsers();
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('avatar', { storage }))
  async register(
    @Body() body: any,
    @Res() res: any,
    @UploadedFile() file?: any,
  ) {
    console.log(file?.path)
    console.log("BODY:", body);
console.log("FILE:", file);
    if(!file?.path){
      return res.json({message: "No Avatar Uploaded"});
    }
    return this.userService.create(res,{
      username: body.username,
      email: body.email,
      password: body.password,
      avatar: file?.path,
    });
  }

  @Post('login')
  async find(
    @Body('email') email: any,
    @Body('password') password: any,
    @Res() res: any,
  ) {
    return this.userService.login(res,{
      email: email,
      password: password,
    });
  }

  @Get('find/:id')
  async findById(
    @Res() res: any,
    @Param('id') id: any
  ) {
    return this.userService.findById(res,id)
  }

  @Get('findbyemail/:email')
  async findByEmail(
    @Res() res: any,
    @Param('email') email: any
  ) {
    return this.userService.findByEmail(res,email)
  }
}
