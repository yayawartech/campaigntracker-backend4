import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Ulid } from 'id128';

@Entity({ tableName: 'ad_accounts' })
export class AdAccountsEntity {
  @PrimaryKey({ type: 'string', length: 32 })
  id: string;

  @Property({ type: 'string', length: 20, default: 'facebook' })
  source: string;

  @Property({ type: 'string', length: 30 })
  accountId: string;

  @Property({ type: 'string', length: 255 })
  name: string;

  @Property({ type: 'string', length: 100 })
  timeZone: string;

  @Property({ type: 'string', length: 20 })
  status: string;

  @Property({ type: 'datetime' })
  updatedDate: Date;

  constructor(source: string, accountId: string, name: string,timeZone: string, status: string) {
    this.id = Ulid.generate().toRaw();
    this.source = source;
    this.accountId = accountId;
    this.name = name;
    this.timeZone = timeZone;
    this.status = status;
    this.updatedDate = new Date();
  }
}
