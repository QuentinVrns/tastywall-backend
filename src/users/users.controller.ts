import {
  Controller,
  Post,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sync')
  async syncUser(@Request() req) {
    const { uid, email } = req.user;
    return await this.usersService.syncUser(uid, email);
  }

  @Get('me')
  async getMe(@Request() req) {
    const { uid } = req.user;
    return await this.usersService.getUserByFirebaseUid(uid);
  }

  @Post('update')
  async updateUser(
    @Request() req,
    @Body() body: { name?: string; age?: number; photoUrl?: string },
  ) {
    const { uid } = req.user;
    return await this.usersService.updateUser(uid, body);
  }
}
