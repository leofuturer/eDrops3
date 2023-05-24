import type { Entity, Count } from "@loopback/repository";

export type DTO<T extends Entity> = Omit<T, keyof Entity>;

export type * from '../../models';
export type { Entity, Count };