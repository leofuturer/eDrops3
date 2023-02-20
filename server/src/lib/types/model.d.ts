import { Entity } from "@loopback/repository";

type DTO<T extends Entity> = Omit<T, keyof Entity>;