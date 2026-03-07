import { Injectable, ConflictException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

@Injectable()
export class UserService {
      constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  sayHelloUsers() {
    return { message: 'Hello Users 👋' };
  }

  async create(res,data) {
    try {
    // 1️⃣ Check email
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      return res.status(200).json({message:"This User Email Already Exists"})  
    }

    // 2️⃣ Hash password

    // 3️⃣ Create user
    const user = await this.userModel.create({
      username: data.username,
      email: data.email,
      password: data.password,
      avatar: data.avatar,
    });

    // 4️⃣ Return safe response
    return res.status(201).json({message: "user created succ",user:{
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    }});
    } catch (error) {
     return res.status(500).json({message:"Error While Create New User", error: error})  
    }
  }

  async login(res,data) {
    try {
    // 1️⃣ Check email
    const foundUser = await this.userModel.findOne({ email: data.email });

    if(!foundUser) {
      return res.status(200).json({message: "No User With This Email"});
    }
    
    if(data.password != foundUser.password){
      return res.status(200).json({message: "Wrong Password"});
    }

    // 4️⃣ Return safe response
    return res.status(200).json({message: "your account has been found",user:foundUser});
    } catch (error) {
      res.status(500).json({message:"Error While login User", error: error})  
    }
  }
  async findById(res,id) {
    try {
    // 1️⃣ Check email
    const foundUser = await this.userModel.findById(id);

    if(!foundUser) {
      return res.status(404).json({message: "No User With This id"});
    }

    // 4️⃣ Return safe response
    return res.status(200).json({message: "your account has been found",user:foundUser});
    } catch (error) {
      res.status(500).json({message:"Error While Finding user", error: error})  
    }
  }

  async findByEmail(res,email) {
    try {
    // 1️⃣ Check email
    const foundUser = await this.userModel.findOne({email: email});

    if(!foundUser) {
      return res.status(200).json({message: "No User With This Email"});
    }

    // 4️⃣ Return safe response
    return res.status(200).json({message: "There Is An Account",Account:foundUser});
    } catch (error) {
      res.status(500).json({message:"Error While Finding user", error: error})  
    }
  }

  
}
