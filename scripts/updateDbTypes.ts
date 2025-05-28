import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const PROJECT_ID = 'yydbuesqphlktcckjyhn';
const DB_TYPES_PATH = path.join(
  process.cwd(),
  'src',
  'lib',
  'supabase',
  'database.types.ts'
);

try {
  console.log('Generating updated Supabase types...');
  const updatedTypes = execSync(
    `npx supabase gen types --lang=typescript --project-id "${PROJECT_ID}"`,
    { encoding: 'utf-8' }
  );

  console.log('Writing updated types to file...');
  fs.writeFileSync(DB_TYPES_PATH, updatedTypes);

  console.log('Database types updated successfully!');
} catch (error) {
  console.error('Error updating database types:', error);
  process.exit(1);
}
