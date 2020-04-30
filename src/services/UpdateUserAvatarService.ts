import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';
import User from '../models/User';
import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const validUser = await userRepository.findOne({
      where: {
        id: user_id,
      },
    });

    if (!validUser) {
      throw Error('Only authenticate users can update the avatar.');
    }
    if (validUser.avatar) {
      // deleting the old avatar
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        validUser.avatar,
      );

      const userAvatarAlreadyExists = await fs.promises.stat(
        userAvatarFilePath,
      );
      if (userAvatarAlreadyExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    validUser.avatar = avatarFilename;
    userRepository.save(validUser);

    return validUser;
  }
}

export default UpdateUserAvatarService;
