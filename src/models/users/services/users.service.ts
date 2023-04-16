import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ICreateUser } from '../interfaces/users.interface';

import { JwtService } from '@nestjs/jwt';

// Bcrypt
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UsersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * @description Handle Generate JWT Token
   * @param {Object} user
   * @returns {String} JWT Token
   */
  private generateJwtToken({ user }): string {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * @description Handle Sign In by email
   * @param {Object} payload
   * @returns {Promise<any>}
   */
  async signInByEmail(user: UserEntity): Promise<any> {
    try {
      const token = this.generateJwtToken({ user });

      return {
        ...user,
        access_token: token,
      };
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.message,
      });
    }
  }

  /**
   * @description Handle Validate Users
   * @param {String} email
   * @param {String} password
   * @returns {Promise<any>}
   */
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.UsersRepository.findOne({ where: { email } });
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { ...result } = user;

      return result;
    }

    return null;
  }

  /**
   * @description Handle find all users
   *
   * @returns {Promise<UserEntity[]>}
   */
  findAllUsers(): Promise<UserEntity[]> {
    return this.UsersRepository.find();
  }

  /**
   * @description Handle create user
   * @param {Object} payload
   * @returns {Promise<UserEntity>}
   */
  createUser(payload: ICreateUser): Promise<UserEntity> {
    try {
      const user = this.UsersRepository.create(payload);

      return this.UsersRepository.save(user);
    } catch (error) {
      console.log(error.code, 'code');
      if (error.code === '23505') {
        throw new BadRequestException('Bad Request', {
          cause: new Error(),
          description: 'Email already exists',
        });
      }
    }
  }
}
