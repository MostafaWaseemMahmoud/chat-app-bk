import {IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator"

export class sendEmailDto {
    @IsEmail({},{each:true})
    recipients: string[];
    
    @IsString()
    subject: string;
    @IsString()
    @IsString()
    html: string;
    
    @IsOptional()
    @IsString()
    text?: string;

}