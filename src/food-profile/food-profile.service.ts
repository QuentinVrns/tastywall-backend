import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FoodProfileService {
  constructor(private prisma: PrismaService) {}

  async getFoodProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid: userId },
      include: { foodProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.foodProfile;
  }

  async updateFoodProfile(
    userId: string,
    data: {
      diets?: string[];
      allergies?: string[];
      intolerances?: string[];
      likes?: string[];
      dislikes?: string[];
      bannedFoods?: string[];
    },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { firebaseUid: userId },
      include: { foodProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.foodProfile) {
      return await this.prisma.foodProfile.update({
        where: { userId: user.id },
        data,
      });
    } else {
      return await this.prisma.foodProfile.create({
        data: {
          userId: user.id,
          diets: data.diets || [],
          allergies: data.allergies || [],
          intolerances: data.intolerances || [],
          likes: data.likes || [],
          dislikes: data.dislikes || [],
          bannedFoods: data.bannedFoods || [],
        },
      });
    }
  }
}
