import { neon,neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);
export const db = drizzle({ client: sql });
