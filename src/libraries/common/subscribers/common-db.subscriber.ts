import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class CommonDBSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<any>): void | Promise<any> {
    const {
      entity,
      queryRunner: {
        data: { action, user },
      },
    } = event;

    if (action === 'CREATE' && user.id && user.name) {
      entity.createdById = user.id;
      entity.createdBy = user.name;
    }
  }

  beforeUpdate(event: UpdateEvent<any>): void | Promise<any> {
    const {
      entity,
      queryRunner: {
        data: { action, user },
      },
    } = event;

    if (action === 'UPDATE') {
      entity.updateById = user?.id ?? null;
      entity.updatedBy = user?.name ?? null;
    }

    if (action === 'DELETE') {
      entity.deleteById = user?.id ?? null;
      entity.deletedBy = user?.name ?? null;
    }

    if (action === 'RESTORE') {
      entity.deletedBy = null;
      entity.deletedById = null;
    }
  }
}
