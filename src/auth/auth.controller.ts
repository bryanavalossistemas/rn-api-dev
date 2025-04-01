import { AuthService } from '@/auth/auth.service';
import { Public } from '@/auth/decorators/is-public.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { ForgotPasswordDto } from '@/auth/dto/forgot-password.dto';
import { GoogleCodeDto } from '@/auth/dto/google-code.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { ResetPasswordDto } from '@/auth/dto/reset-password.dto';
import { SendVerificationDto } from '@/auth/dto/send-verification.dto';
import { VerifyEmailDto } from '@/auth/dto/verify-email.dto';
import { Controller, Post, Body, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('/google')
  async google(@Body() googleCodeDto: GoogleCodeDto) {
    return await this.authService.google(googleCodeDto.code);
  }

  @Public()
  @Post('send-verification')
  async sendVerification(@Body() sendVerificationDto: SendVerificationDto) {
    const { email } = sendVerificationDto;

    return await this.authService.sendVerification(email);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const { token } = verifyEmailDto;

    return await this.authService.verifyEmail(token);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;

    return this.authService.forgotPassword(email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { token, password } = resetPasswordDto;

    return this.authService.resetPassword(token, password);
  }

  @Roles('user')
  @Get('me')
  me() {
    return { message: 'me' };
  }

  @Public()
  @Get('hello')
  hello() {
    {
      return JSON.stringify('Hello World');
    }
  }
}
