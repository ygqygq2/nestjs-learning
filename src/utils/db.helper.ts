import { SelectQueryBuilder } from 'typeorm';

export const contidtionUtils = <T>(queryBuilder: SelectQueryBuilder<T>, object: Record<string, unknown>) => {
  Object.keys(object).forEach((key) => {
    if (object[key]) {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: object[key] });
    }
  });
  return queryBuilder;
};
