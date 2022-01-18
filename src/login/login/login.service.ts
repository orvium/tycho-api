import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDataDto } from '../../dtos/login-data/login-data.dto';
import { Consumer } from '../../entities/consumer.entity';
import { Donor } from '../../entities/donor.entity';
import { USER_ROLE } from '../../entities/user.entity';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(Donor.name) private readonly donorModel: Model<Donor>,
    @InjectModel(Consumer.name) private readonly consumerModel: Model<Consumer>,
  ) {}
  
  async login(loginDto: LoginDataDto) {
    const model = loginDto.role === USER_ROLE.consumer
      ? this.consumerModel
      : this.donorModel;

    const user = await model.findOne(
      { email: loginDto.email, password: loginDto.password }
    );

    if (!user) throw new NotFoundException('No such user in base');

    return user;
  }
}
