import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Préfixe global pour toutes les routes
  app.setGlobalPrefix('api');

  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:4200'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('TastyWall API')
    .setDescription(
      'Documentation de l\'API TastyWall Backend\n\n' +
      '## Comment tester l\'API avec authentification:\n\n' +
      '```bash\n' +
      'curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=VOTRE_API_KEY" \\\n' +
      '  -H "Content-Type: application/json" \\\n' +
      '  -d \'{"email":"votre@email.com","password":"votre_password","returnSecureToken":true}\'\n' +
      '```\n' +
      'Récupérez le `idToken` dans la réponse.'
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Entrez votre Firebase ID token',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📚 Swagger documentation available at http://localhost:${port}/docs`);
}
bootstrap();
