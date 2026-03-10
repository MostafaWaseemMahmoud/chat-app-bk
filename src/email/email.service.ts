import { Options } from './../../node_modules/@types/validator/lib/isBoolean.d';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from 'src/dto/email.dto';
@Injectable()
export class EmailService {
    emailTransport() {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'mostafawaseem22@gmail.com',
                pass: 'grqf psfz raog ptpg',
            },
        })
        return transporter;
    }
    async sendEmail(dto: sendEmailDto){
        const {recipients,subject,html} = dto

        const transport = this .emailTransport();

        const options: nodemailer.sendMailOptions = {
            from: 'mostafawaseem22@gmail.com',
            to: recipients,
            subject: subject,
            html:html,
        };


        try {
            await transport.sendMail(options);
            console.log("Email Sent Succ!!")
        }catch(e){
            console.log('error sending mail: ' , e)
        }

    }
}
