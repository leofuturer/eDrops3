import type { Count, Entity, Filter, FilterExcludingWhere, Where } from "@loopback/repository";
import type { Request, Response } from "@loopback/rest";
import { Material } from "./chip";

export type DTO<T extends Entity> = Omit<T, keyof Entity>;

export type * from '../../models';
export type { Entity, Count, Filter, Where, FilterExcludingWhere, Request, Response };
export { Material };

