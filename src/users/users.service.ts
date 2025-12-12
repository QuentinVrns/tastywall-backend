import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async syncUser(firebaseUid: string, email: string) {
    const existingUser = await this.prisma.user.findUnique({
      where: { firebaseUid },
    });

    if (existingUser) {
      if (existingUser.email !== email) {
        return await this.prisma.user.update({
          where: { firebaseUid },
          data: { email },
        });
      }
      return existingUser;
    }

    return await this.prisma.user.create({
      data: {
        firebaseUid,
        email,
      },
    });
  }

  async getUserByFirebaseUid(firebaseUid: string) {
    return await this.prisma.user.findUnique({
      where: { firebaseUid },
      include: { foodProfile: true },
    });
  }

  async updateUser(
    firebaseUid: string,
    data: { name?: string; age?: number; photoUrl?: string },
  ) {
    return await this.prisma.user.update({
      where: { firebaseUid },
      data,
    });
  }
}
