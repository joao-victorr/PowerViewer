// import { Routes } from '@Routes/MainRoutes';

import { ErrorsHandler } from 'Domain/Errors/ErrorsHandler';
import { Routes } from 'Http/MainRoutes';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';


const server = fastify({logger: {
  level: 'error',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
}}).withTypeProvider<ZodTypeProvider>();



server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Fastify Zod Example',
      description: 'An example of using Fastify with Zod for validation',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],

    components: {
      securitySchemes: {
        // Exemplo de esquema para Bearer Token (o mais comum para JWT)
        bearerAuth: { // <-- Este é o nome que você usará no 'security' das rotas
          type: 'http',
          scheme: 'Bearer',
          bearerFormat: 'JWT', // Opcional, mas útil para documentação
          description: 'Autenticação com token JWT. Cole o token completo aqui (ex: "Bearer SEU_TOKEN_AQUI")',
        }
      }
    },
  },
  transform: jsonSchemaTransform
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})

// Registrar o manipulador de erros global
server.setErrorHandler(ErrorsHandler);


Routes(server);


server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});





