import { Repository } from 'typeorm';

import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { SingleSignOn } from '../entities/single-sign-on.entity';

// import { CreateSsoDto } from './dto';

@Injectable()
export class SingleSignOnService {
  @InjectRepository(SingleSignOn)
  private readonly repository: Repository<SingleSignOn>;

  async create(payload): Promise<SingleSignOn> {
    try {
      const singleSignOn = new SingleSignOn();
      this.repository.merge(singleSignOn, payload);

      return await this.repository.save(singleSignOn);
    } catch (err) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async findByValidToken(token: string): Promise<SingleSignOn> {
    try {
      const currentTime = Math.floor(Date.now() / 1000);

      return this.repository
        .createQueryBuilder('single_sign_on')
        .where(`single_sign_on.token = :token`, {
          token,
        })
        .andWhere(`single_sign_on.valid_to > :currentTime`, {
          currentTime,
        })
        .cache(true)
        .getOne();
    } catch (err) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async isLogin(
    userId: string,
    userType: string,
    access: string,
  ): Promise<SingleSignOn> {
    try {
      const currentTime = Math.floor(Date.now() / 1000);

      return await this.repository
        .createQueryBuilder('single_sign_on')
        .where(`single_sign_on.user_id = :userId`, {
          userId,
        })
        .andWhere(`single_sign_on.user_type = :userType`, {
          userType,
        })
        .andWhere(`single_sign_on.access = :access`, {
          access,
        })
        .andWhere(`single_sign_on.valid_to > :currentTime`, {
          currentTime,
        })
        .orderBy({ created_at: 'DESC' })
        .getOne();
    } catch (err) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async revokeBySystem(): Promise<void> {
    try {
      const currentTime = Math.floor(Date.now() / 1000);

      const activeSessions = await this.repository
        .createQueryBuilder('single_sign_on')
        .andWhere(`single_sign_on.valid_to > :currentTime`, {
          currentTime,
        })
        .getMany();

      for await (const sso of activeSessions) {
        await this.revokeSso(sso.id);
      }
    } catch (err) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: err.message,
      });
    }
  }

  async revokeSso(id: string): Promise<any> {
    try {
      const currentTime = Math.floor(Date.now() / 1000);

      return await this.repository.update(id, { validTo: currentTime });
    } catch (err) {
      throw new BadRequestException('Bad Request', {
        cause: new Error(),
        description: err.message,
      });
    }
  }
}
