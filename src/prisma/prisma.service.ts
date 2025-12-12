import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({
      connectionString,
      // Force UTF-8 encoding for all connections
      client_encoding: 'UTF8',
    });

    // Execute SET client_encoding on every connection
    pool.on('connect', (client) => {
      client.query('SET client_encoding TO UTF8;');
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Prisma connected to PostgreSQL');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('❌ Prisma disconnected from PostgreSQL');
  }
}
