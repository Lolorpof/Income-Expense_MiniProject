import { Pool } from 'pg';

export default async function testPoolConnection(pool: Pool): Promise<boolean> {
  try {
    await pool.connect();
    return true;
  } catch (error) {
    return false;
  }
}
