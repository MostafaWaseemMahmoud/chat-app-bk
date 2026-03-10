import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { sendEmailDto } from 'src/dto/email.dto';
@Controller('email')
export class EmailController {
    constructor(private readonly emailService: EmailService){};

    @Post("sendmail")
    async sendMail(@Body() dto:sendEmailDto) {
        await this.emailService.sendEmail(dto);
        return {message: "email sent"}
    }
}
