import type { Count, Entity, Filter, FilterExcludingWhere, Where } from "@loopback/repository";
// import type { Request, Response } from "@loopback/rest";

export type DTO<T extends Entity> = Omit<T, keyof Entity>;

export type { Entity, Count, Filter, Where, FilterExcludingWhere };

export * from '../../models';