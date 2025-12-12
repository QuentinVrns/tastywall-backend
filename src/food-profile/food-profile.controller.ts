import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FoodProfileService } from './food-profile.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('food-profile')
@UseGuards(FirebaseAuthGuard)
export class FoodProfileController {
  constructor(private readonly foodProfileService: FoodProfileService) {}

  @Get()
  async getFoodProfile(@Request() req) {
    const { uid } = req.user;
    return await this.foodProfileService.getFoodProfile(uid);
  }

  @Patch()
  async updateFoodProfile(
    @Request() req,
    @Body()
    body: {
      diets?: string[];
      allergies?: string[];
      intolerances?: string[];
      likes?: string[];
      dislikes?: string[];
      bannedFoods?: string[];
    },
  ) {
    const { uid } = req.user;
    return await this.foodProfileService.updateFoodProfile(uid, body);
  }
}
