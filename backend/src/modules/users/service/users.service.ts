import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Users } from '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findOne(data: number | any): Promise<Users | undefined> {
    return await this.usersRepository.findOne(data);
  }

  async findAll(): Promise<Users[]> {
    return this.usersRepository.find({
      select: [
        'id',
        'user_id',
        'name',
        'email',
        'role',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findOneByEmail(email: string): Promise<Users | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async create(data) {
    return await this.usersRepository
      .save(data)
      .then((res) => res)
      .catch((e) => console.log(e));
  }

  async update(user: Users) {
    return this.usersRepository.save(user);
  }

  async deleteByEmail(email: string): Promise<DeleteResult> {
    return this.usersRepository.delete({ email });
  }

  async updateByEmail(
    email: string,
    updateData: Partial<Users>,
  ): Promise<boolean> {
    const result = await this.usersRepository.update({ email }, updateData);
    return result.affected > 0;
  }
}
