import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { CreateUserData } from '../types/user';

export class AuthService {
  private prisma = new PrismaClient();

  async findUserByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new Error('Database error while finding user');
    }
  }

  async createUser(userData: CreateUserData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      return await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new Error('Database error while creating user');
    }
  }
}