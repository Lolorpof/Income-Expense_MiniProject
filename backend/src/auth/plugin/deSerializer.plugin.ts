import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyReply,
  FastifyRequest,
} from 'fastify';
import { UserService } from 'src/user/user.service';

export function deSerializerPlugin(
  userService: UserService,
): FastifyPluginAsync {
  return async function (fastifyInstance) {
    fastifyInstance.addHook(
      'preHandler',
      async (req: FastifyRequest, _res: FastifyReply) => {
        console.log('✅ Hook is running!');

        // check session
        // not existed
        console.log(`SESSIOIN: ${req.session}`);
        if (!req.session?.user) {
          req.user = undefined;
        }
        // existed
        else {
          const currentUser = await userService.findById(req.session.user.id);
          req.user = currentUser;
        }
      },
    );
  };
}
