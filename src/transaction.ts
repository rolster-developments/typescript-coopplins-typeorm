import { createRunner } from './sql-manager';

type Callback<T> = () => Promise<T | void>;
type Result<T> = Promise<T | void>;

export async function transaction<T = any>(callback: Callback<T>): Result<T> {
  const runner = createRunner();

  if (!runner) {
    return Promise.resolve();
  }

  try {
    await runner.connect();
    await runner.startTransaction();

    const result = await callback();

    await runner.commitTransaction();

    return result;
  } catch (error) {
    await runner.rollbackTransaction();

    throw error;
  } finally {
    await runner.release();
  }
}
