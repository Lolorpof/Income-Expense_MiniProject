import 'fastify';
import { TUser } from 'src/user/types/type';

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
