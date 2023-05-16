import crypto from 'crypto';
import { Entity, EntityDTO, PrimaryKey, Property } from '@mikro-orm/core';
import { Ulid } from 'id128';

@Entity({ tableName: 'users' })
export class UsersEntity {
  @PrimaryKey({ type: 'string', length: 32 })
  id: string;

  @Property()
  name: string;

  @Property({ hidden: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  constructor(name: string, email: string, password: string) {
    this.id = Ulid.generate().toRaw();
    this.name = name;
    this.email = email;
    this.password = crypto.createHmac('sha256', password).digest('hex');
  }
}

interface UserDTO extends EntityDTO<UsersEntity> {
  following?: boolean;
}
