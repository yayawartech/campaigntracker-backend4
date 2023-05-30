import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Ulid } from 'id128';

@Entity({ tableName: 'ad_sets' })
export class AdSetsEntity {
  @PrimaryKey({ type: 'string', length: 32 })
  id: string;

  @Property({ nullable: true })
  status: string;

  @Property({ nullable: true })
  facebook_id: string;

  @Property({ nullable: true })
  adaccount_id: string;

  @Property({ nullable: true })
  name: string;

  @Property({ nullable: true })
  daily_budget: string;

  @Property({ nullable: true })
  created_time: string;

  @Property({ nullable: true })
  start_time: string;

  @Property({ nullable: true })
  created_at: Date;

  @Property({ nullable: true })
  updated_at: Date;

  constructor(
    id: string,
    status: string,
    name: string,
    daily_budget: string,
    created_time: string,
    start_time: string,
    adaccount_id: string,
  ) {
    this.id = Ulid.generate().toRaw();
    this.facebook_id = id;
    this.status = status;
    this.name = name;
    this.daily_budget = daily_budget;
    this.created_time = created_time;
    this.start_time = start_time;
    this.adaccount_id = adaccount_id;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
}
