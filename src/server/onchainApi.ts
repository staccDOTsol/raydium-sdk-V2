import express from 'express';
import dotenv from 'dotenv';
import { Connection } from '@solana/web3.js';
import { createClient, RedisClientType } from 'redis';
import { CREATE_CPMM_POOL_PROGRAM, CLMM_PROGRAM_ID } from '../common/programId';
import {
  generateAMMs,
  generatePairs,
  updateOHLCV,
} from './onchainUtils';

dotenv.config();

const HELIUS_API_KEY = process.env.HELIUS_API_KEY as string;
const HELIUS_API_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

const connection = new Connection(HELIUS_API_URL, {
  commitment: 'confirmed',
});

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient: RedisClientType = createClient({ url: redisUrl });
redisClient.connect().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to connect to Redis', err);
});

const app = express();
const PORT = process.env.PORT || 3000;

let ammCache: any[] = [];
let pairCache: any[] = [];

async function load() {
  const programs = {
    [CREATE_CPMM_POOL_PROGRAM.toBase58()]: 'cpswap',
    [CLMM_PROGRAM_ID.toBase58()]: 'clmm',
  };
  ammCache = await generateAMMs(connection, programs);
  await updateOHLCV(connection, ammCache, redisClient);
  pairCache = await generatePairs(connection, ammCache, programs, ammCache.length, redisClient);
}

app.get('/pairs', async (_req, res) => {
  if (!pairCache.length) {
    await load();
  }
  res.json(pairCache);
});

app.post('/refresh', async (_req, res) => {
  await load();
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Onchain API server listening on port ${PORT}`);
});

