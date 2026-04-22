import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  logger: Logger = new Logger(JwtMiddleware.name);

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Authorization header

    if (token) {
      try {
        // const decoded = verify(token, String(process.env['JWT_SECRET'])); // Verify and decode the token
        const decoded = verify(token, String(process.env['JWT_SECRET'])); // Verify and decode the token
        req.user = decoded; // Attach user details to request object
      } catch (error) {
        // Handle token verification errors
        this.logger.error(`EXCEPTION => ${JSON.stringify(error, null)}`);
        return res
          .status(401)
          .json({ message: 'Invalid or Expired token', error: error });
      }
    }
    next();
  }
}
