import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    if (specifier.startsWith('.') || specifier.startsWith('/')) {
      const parentDir = context.parentURL ? path.dirname(fileURLToPath(context.parentURL)) : process.cwd();
      const targetPath = path.resolve(parentDir, specifier);
      if (fs.existsSync(targetPath + '.js')) {
        return nextResolve(pathToFileURL(targetPath + '.js').href, context);
      }
      if (fs.existsSync(targetPath + '.jsx')) {
        return nextResolve(pathToFileURL(targetPath + '.jsx').href, context);
      }
      if (fs.existsSync(path.join(targetPath, 'index.js'))) {
        return nextResolve(pathToFileURL(path.join(targetPath, 'index.js')).href, context);
      }
    }
    throw err;
  }
}
