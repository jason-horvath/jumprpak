import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
export type DeleteResult = ResultSetHeader;

export type FindOneResult = RowDataPacket;
export type FindManyResult = RowDataPacket[];

export type InsertData = Map<InsertDataKey, InsertDataValue>;

export type InsertDataKey = string;

export type InsertDataValue = string | number | null;

export type InsertFields = Array<string>;

export type InsertValues = Array<string | number | null>;

export type InsertResult = ResultSetHeader;

export type UpdateResult = ResultSetHeader;

export type PromiseInsertResult = Promise<InsertResult | Error>;
