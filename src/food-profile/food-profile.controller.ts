import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { FoodProfileService } from './food-profile.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('Food Profile')
@ApiBearerAuth()
@Controller('food-profile')
@UseGuards(FirebaseAuthGuard)
export class FoodProfileController {
  constructor(private readonly foodProfileService: FoodProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Obtenir le profil alimentaire de l\'utilisateur' })
  async getFoodProfile(@Request() req) {
    const { uid } = req.user;
    return await this.foodProfileService.getFoodProfile(uid);
  }

  @Post()
  @ApiOperation({ summary: 'Mettre à jour le profil alimentaire de l\'utilisateur' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        diets: {
          type: 'array',
          items: { type: 'string' },
          example: ['vegetarian', 'gluten-free']
        },
        allergies: {
          type: 'array',
          items: { type: 'string' },
          example: ['peanuts', 'shellfish']
        },
        intolerances: {
          type: 'array',
          items: { type: 'string' },
          example: ['lactose', 'gluten']
        },
        likes: {
          type: 'array',
          items: { type: 'string' },
          example: ['pizza', 'pasta']
        },
        dislikes: {
          type: 'array',
          items: { type: 'string' },
          example: ['mushrooms', 'olives']
        },
        bannedFoods: {
          type: 'array',
          items: { type: 'string' },
          example: ['pork', 'alcohol']
        },
      },
    },
  })
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
