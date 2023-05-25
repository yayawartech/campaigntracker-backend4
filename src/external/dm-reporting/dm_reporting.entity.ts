import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Ulid } from 'id128';

@Entity({ tableName: 'external_api' })
export class DMReportingEntity {
  @PrimaryKey({ type: 'string', length: 32 })
  id: string;

  @Property({ nullable: true })
  advertiser: string;

  @Property({ nullable: true })
  domain: string;

  @Property({ nullable: true })
  manager: string;

  @Property({ nullable: true })
  buyer: string;

  @Property({ nullable: true })
  date: string;

  @Property({ nullable: true })
  hour: number;

  @Property({ nullable: true })
  campaign: string;

  @Property({ nullable: true })
  adset: string;

  @Property({ nullable: true })
  adsetid: number;

  @Property({ nullable: true })
  revenue: number;

  @Property({ nullable: true })
  spend: number;

  @Property({ nullable: true })
  link_clicks: number;

  @Property({ nullable: true })
  ad_clicks: number;

  @Property({ nullable: true })
  gp: number;

  @Property({ nullable: true })
  searches: number;

  @Property({ nullable: true })
  clicks: number;

  @Property({ nullable: true })
  tq: number;

  constructor(
    advertiser: string,
    domain: string,
    manager: string,
    buyer: string,
    date: string,
    hour: number,
    campaign: string,
    adset: string,
    adset_id: number,
    revenue: number,
    spend: number,
    link_clicks: number,
    ad_clicks: number,
    gp: number,
    searches: number,
    clicks: number,
    tq: number
  ) {
    this.id = Ulid.generate().toRaw();
    this.advertiser = advertiser;
    this.domain = domain;
    this.manager = manager;
    this.buyer = buyer;

    // The date in the response is in yyyy:mm:ddT{timestamp} format hence conversion
    // to UTC format is not required.
    this.date = date;
    this.hour = hour;

    this.campaign = campaign;
    this.adset = adset;
    this.adsetid = adset_id;
    this.revenue = revenue;
    this.spend = spend;
    this.link_clicks = link_clicks;
    this.ad_clicks = ad_clicks;
    this.gp = gp;
    this.searches = searches;
    this.clicks = clicks;
    this.tq = tq;
  }
}
