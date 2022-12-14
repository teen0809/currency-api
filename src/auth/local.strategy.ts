import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from 'src/users/dtos/LoginUser.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const userInfo : LoginUserDto = {
      username: username,
      password: password,
    }
    const user = await this.authService.validateUser(userInfo);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}