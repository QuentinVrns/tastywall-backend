import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FoodProfileModule } from './food-profile/food-profile.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, UsersModule, FoodProfileModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
