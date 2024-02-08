

/**
 * Создание DTO // Использовать только Pick<> для второго джейнерика
 */
export function createDTO<T,K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  let result = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}


