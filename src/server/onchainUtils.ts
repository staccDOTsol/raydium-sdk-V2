import { Connection, PublicKey } from '@solana/web3.js';

interface RedisLike {
  hGet(key: string, field: string): Promise<string | null>;
  hSet?(key: string, field: string, value: string): Promise<any>;
}

class AMM {
  constructor(
    public virtualSolReserves: bigint,
    public virtualTokenReserves: bigint,
    public realSolReserves: bigint,
    public realTokenReserves: bigint,
    public initialVirtualTokenReserves: bigint,
    public program: string,
    public programId: PublicKey,
    public address: PublicKey,
  ) {}

  getBuyPrice(tokens: bigint) {
    const productOfReserves = this.virtualSolReserves * this.virtualTokenReserves;
    const newVirtualTokenReserves = this.virtualTokenReserves - tokens;
    const newVirtualSolReserves = productOfReserves / newVirtualTokenReserves + BigInt(1);
    return newVirtualSolReserves - this.virtualSolReserves;
  }
}

export async function fetchProgramAccounts(connection: Connection, programId: PublicKey) {
  return connection.getProgramAccounts(programId, { encoding: 'base64' });
}

export async function generateAMMs(connection: Connection, programs: Record<string, string>) {
  const programIds = Object.keys(programs);
  const result: AMM[] = [];

  for (const id of programIds) {
    const accounts = await fetchProgramAccounts(connection, new PublicKey(id));
    for (const { pubkey, account } of accounts) {
      const data = Buffer.from(account.data);
      if (data.length < 40) continue;
      result.push(
        new AMM(
          data.readBigUInt64LE(0),
          data.readBigUInt64LE(8),
          data.readBigUInt64LE(16),
          data.readBigUInt64LE(24),
          data.readBigUInt64LE(32),
          programs[id],
          new PublicKey(id),
          pubkey,
        ),
      );
    }
  }

  return result;
}

export async function generatePairs(
  connection: Connection,
  amms: AMM[],
  programs: Record<string, string>,
  count: number,
  redis: RedisLike,
) {
  const slice = amms.slice(0, count);
  const pairs: any[] = [];

  for (const amm of slice) {
    const key = `OHLCV:${amm.address.toBase58()}`;
    let lastPrice: number | null = null;
    try {
      const stored = await redis.hGet(key, 'data');
      if (stored) {
        const arr = JSON.parse(stored);
        const latest = Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null;
        if (latest && typeof latest.price === 'number') {
          lastPrice = latest.price;
        }
      }
    } catch {
      lastPrice = null;
    }

    const fallbackPrice = Number(amm.getBuyPrice(BigInt(1_000_000))) / 1e9;
    pairs.push({
      address: amm.address.toBase58(),
      programId: amm.programId.toBase58(),
      price: lastPrice ?? fallbackPrice,
    });
  }

  return pairs;
}

export async function updateOHLCV(
  connection: Connection,
  amms: AMM[],
  redis: RedisLike,
) {
  for (const amm of amms) {
    const price = Number(amm.getBuyPrice(BigInt(1_000_000))) / 1e9;
    const key = `OHLCV:${amm.address.toBase58()}`;
    let data: any[] = [];
    try {
      const existing = await redis.hGet(key, 'data');
      if (existing) {
        data = JSON.parse(existing);
      }
    } catch {
      data = [];
    }
    data.push({ timestamp: Date.now(), price });
    if (data.length > 1000) data = data.slice(-1000);
    if (redis.hSet) {
      await redis.hSet(key, 'data', JSON.stringify(data));
    }
  }
}

