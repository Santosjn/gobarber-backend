import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';
import authConfig from '../config/auth';

interface SessionRequest {
  email: string;
  password: string;
}

interface SessionResponse {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({
    email,
    password,
  }: SessionRequest): Promise<SessionResponse> {
    const userRepository = getRepository(User);

    const userWithEmailFound = await userRepository.findOne({
      where: { email },
    });
    if (!userWithEmailFound) {
      throw Error('Incorrect email/password combination');
    }

    const passwordMatch = await compare(password, userWithEmailFound.password);
    if (!passwordMatch) {
      throw Error('Incorrect email/password combination');
    }

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: userWithEmailFound.id,
      expiresIn,
    });

    return {
      user: userWithEmailFound,
      token,
    };
  }
}

export default CreateSessionService;
