import type { Count, Entity, Filter, FilterExcludingWhere, Where } from "@loopback/repository";

export type DTO<T extends Entity> = Omit<T, keyof Entity>;

export type * from '../../models';
export type { Entity, Count, Filter, Where, FilterExcludingWhere};
