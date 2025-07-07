import { PrismaClient } from "@prisma/client";

export const repo = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? [
        // { emit: 'stdout', level: 'query' },
        // { emit: 'stdout', level: 'info' },
        // { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ]
    : [{ emit: 'stdout', level: 'error' }],
});
