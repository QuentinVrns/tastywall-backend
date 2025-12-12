import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { admin } from '../firebase/firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded = await admin.auth().verifyIdToken(token);

      request.user = {
        uid: decoded.uid,
        email: decoded.email,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
