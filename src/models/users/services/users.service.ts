import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { ICreateUser } from '../interfaces/users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly UsersRepository: Repository<Users>,
  ) {}

  /**
   * @description Handle find all users
   *
   * @returns {Promise<Users[]>}
   */
  findAllUsers(): Promise<Users[]> {
    return this.UsersRepository.find();
  }

  /**
   * @description Handle create user
   * @param {Object} payload
   * @returns {Promise<Users>}
   */
  createUser(payload: ICreateUser): Promise<Users> {
    const user = this.UsersRepository.create(payload);

    return this.UsersRepository.save(user);
  }
}
