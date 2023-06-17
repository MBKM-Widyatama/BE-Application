import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SelectQueryBuilder, Repository, UpdateResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import { ICreateUser } from '../interfaces/users.interface';
import {
  ListOptionDto,
  PageMetaDto,
  PaginateDto,
  getSortColumns,
  IResultFilters,
} from 'src/libraries/common';
import { ConfigService } from '@nestjs/config';
import { VerificationEmailService } from 'src/libraries/common/mailers/verification-email/services/verification-email.service';

// Bcrypt
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UsersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly verificationEmailService: VerificationEmailService,
  ) {}

  /**
   * @description Handle filters data
   * @param {Object} filters @type ListOptionDto
   * @param {SelectQueryBuilder<UserEntity>} query
   *
   * @returns {Promise<IResultFilters>}
   */
  private async filtersData(
    filters: ListOptionDto,
    query: SelectQueryBuilder<UserEntity>,
  ): Promise<IResultFilters> {
    try {
      // Has relationships

      if (filters.search) {
        query.andWhere(
          'users.name ILIKE :search OR users.email ILIKE :search',
          {
            search: `%${filters.search}%`,
          },
        );
      }

      if (filters.isDeleted) {
        query.andWhere('users.deleted_at IS NOT NULL');
      } else {
        query.andWhere('users.deleted_at IS NULL');
      }

      if (filters.sort) {
        const orderBy = getSortColumns(filters.sort);
        query.orderBy(orderBy);
      }

      if (!filters.disablePaginate) {
        query.limit(filters.limit);
        query.offset(filters.skip);
      }

      const [data, totalData] = await query.cache(true).getManyAndCount();
      const total = data.length;

      return {
        data,
        total,
        totalData,
      };
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

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
      role: user.role.name,
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
    const user = await this.UsersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { ...result } = user;

      return result;
    }

    return null;
  }

  /**
   * @description Handle find all users
   * @param {Object} filters @type ListOptionDto
   *
   * @returns {Promise<PaginateDto<UserEntity>>}
   */
  async findAllUsers(filters: ListOptionDto): Promise<PaginateDto<UserEntity>> {
    try {
      const query: SelectQueryBuilder<UserEntity> =
        this.UsersRepository.createQueryBuilder('users');
      const { data, total, totalData } = await this.filtersData(filters, query);
      const meta = new PageMetaDto({
        totalData,
        total,
        page: filters.offset,
        size: filters.disablePaginate ? totalData : filters.limit,
      });

      return new PaginateDto<UserEntity>(data, meta);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle get data user by id
   * @param {String} id
   *
   * @returns {Promise<UserEntity>}
   */
  async findUserById(id: string): Promise<UserEntity> {
    try {
      return await this.UsersRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle get data user by email
   * @param {String} email
   *
   * @returns {Promise<UserEntity>}
   */
  async findUserByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.UsersRepository.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle get data user by reset password token
   * @param {String} token
   *
   * @returns {Promise<UserEntity>}
   */
  async findUserByResetPasswordToken(token: string): Promise<UserEntity> {
    try {
      return await this.UsersRepository.findOne({
        where: {
          reset_password_token: token,
        },
      });
    } catch (error) {
      throw new NotFoundException('Not Found', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle create user
   * @param {Object} payload
   * @returns {Promise<UserEntity>}
   */
  createUser(payload: ICreateUser): Promise<UserEntity> {
    const user = this.UsersRepository.create(payload);

    return this.UsersRepository.save(user);
  }

  /**
   * @description Handle update reset password valid to
   * @param {String} id
   * @param {String} token
   * @param {Number} validTo
   *
   * @returns {Promise<UserEntity>}
   */
  async updateResetPasswordValidTo(
    id: string,
    token: string,
    validTo: number,
  ): Promise<UpdateResult> {
    try {
      return await this.UsersRepository.update(
        {
          id,
        },
        {
          reset_password_token: token,
          reset_password_token_valid_to: validTo,
        },
      );
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle update user using flow reset password
   * @param {String} token
   * @param {String} password
   *
   * @returns {Promise<UserEntity>}
   */
  async resetUserPassword(
    token: string,
    password: string,
  ): Promise<UserEntity> {
    try {
      const selectedUser = await this.findUserByResetPasswordToken(token);

      // Check if token is still valid
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > selectedUser.reset_password_token_valid_to) {
        throw new BadRequestException('Bad Request', {
          cause: new Error(),
          description: 'Token is not valid',
        });
      }

      // Update user password
      const salt = bcrypt.genSaltSync(+this.configService.get('SALT_ROUNDS'));
      const hashedPassword = bcrypt.hashSync(password, salt);
      await this.UsersRepository.update(selectedUser.id, {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_token_valid_to: null,
      });

      return await this.findUserById(selectedUser.id);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }

  /**
   * @description Handle generate reset password token
   * @param {String} email
   *
   * @returns {Promise<UserEntity>}
   */
  async forgotPassword(email: string): Promise<UserEntity> {
    try {
      const selectedUser = await this.findUserByEmail(email);

      // Generate Token random string 32 character with vanilla js
      const customGenerateToken = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

      // Generate OTP Valid to 1 hour with unix timestamp
      const validTo = Math.floor(Date.now() / 1000) + 3600;

      // Update user reset password token
      await this.updateResetPasswordValidTo(
        selectedUser.id,
        customGenerateToken,
        validTo,
      );

      // Send email reset password
      await this.verificationEmailService.sendResetPasswordEmail(
        selectedUser.email,
        selectedUser.name,
        customGenerateToken,
      );

      return await this.findUserById(selectedUser.id);
    } catch (error) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: error.response ? error?.response?.error : error.message,
      });
    }
  }
}
