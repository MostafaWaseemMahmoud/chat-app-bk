import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Room extends Document {

    @Prop()
    userId: String 
    @Prop()
    otherUserId: String 

@Prop({ type: [Object], default: [] })
NewMessages: any[];

@Prop({ type: [Object], default: [] })
Messages: any[];

  @Prop()
  RoomId: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
