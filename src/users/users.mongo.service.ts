import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {UpdateUserDto} from './dto/update-user.dto';
import {User, UserDocument} from './schemas/user.schema';
import {UserDto} from "./dto/user.dto";

@Injectable()
export class UsersMongoService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(user: UserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(user);
    return await createdUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
      id: string,
      updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
