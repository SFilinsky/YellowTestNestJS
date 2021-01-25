import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Length } from 'class-validator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

class LoginDto {
  @ApiProperty()
  username!: string;
  @ApiProperty()
  password!: string;
}

class RegisterDto {
  @ApiProperty({ description: 'From 6 to 60 symbols' })
  @Length(6, 60)
  username!: string;

  @ApiProperty({ description: 'From 4 to 20 symbols' })
  @Length(4, 20)
  password!: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(protected authService: AuthService) {}

  @ApiOperation({ summary: 'Authorize' })
  @ApiBody({
    type: LoginDto,
  })
  @ApiResponse({ status: 200, description: 'Auth success', type: String })
  @ApiResponse({ status: 400, description: 'Auth credentials are wrong' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Register new account' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Account created' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerInfo: RegisterDto) {
    await this.authService.register(
      registerInfo.username,
      registerInfo.password,
    );
    return;
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test authentication' })
  @ApiResponse({ status: 200, description: 'Allowed' })
  @ApiResponse({ status: 403, description: 'Access Forbidden' })
  @UseGuards(JwtAuthGuard)
  @Get('test')
  async jwtTest() {
    return 'success';
  }
}
