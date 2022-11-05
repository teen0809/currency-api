import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';

import { LoginUserDto } from './dtos/LoginUser.dto';


// This should be a real class/interface representing a user entity
export type User1 = any;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findUser(loginUserDto: LoginUserDto) {
    const res = await this.userRepository.findOne({
      where: {
        username: loginUserDto.username
      }
    })
    return res;
  }

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User1 | undefined> {
    return this.users.find(user => user.username === username);
  }
}