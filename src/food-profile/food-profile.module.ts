import { Module } from '@nestjs/common';
import { FoodProfileController } from './food-profile.controller';
import { FoodProfileService } from './food-profile.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FoodProfileController],
  providers: [FoodProfileService, PrismaService],
})
export class FoodProfileModule {}
