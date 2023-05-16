import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'add_accounts' })
export class AdaccountsEntity {
  @PrimaryKey({ type: 'string', length: 32 })
  id: string;

  @Property({ type: 'string', length: 20, default: 'facebook' })
  source: string;

  @Property({ type: 'string', length: 30 })
  account_id: string;

  @Property({ type: 'string', length: 255 })
  name: string;

  @Property({ type: 'string', length: 100 })
  timeZone: string;

  @Property({ type: 'string', length: 20 })
  status: string;

  @Property({ type: 'datetime' })
  updated_date: Date;
}
