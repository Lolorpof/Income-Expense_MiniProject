import 'fastify';
import { TUser } from '../user/types/type';

declare module 'fastify' {
  interface Session {
    user?: {
      id: string;
    };
  }

  interface FastifyRequest {
    session: Session;
    user?: TUser;
  }
}
