import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Synchroniser l\'utilisateur avec Firebase' })
  async syncUser(@Request() req) {
    const { uid, email } = req.user;
    return await this.usersService.syncUser(uid, email);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtenir les informations de l\'utilisateur connecté' })
  async getMe(@Request() req) {
    const { uid } = req.user;
    return await this.usersService.getUserByFirebaseUid(uid);
  }

  @Post('update')
  @ApiOperation({ summary: 'Mettre à jour les informations de l\'utilisateur' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        age: { type: 'number', example: 25 },
        photoUrl: { type: 'string', example: 'https://example.com/photo.jpg' },
      },
    },
  })
  async updateUser(
    @Request() req,
    @Body() body: { name?: string; age?: number; photoUrl?: string },
  ) {
    const { uid } = req.user;
    return await this.usersService.updateUser(uid, body);
  }
}
