import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { Users } from '../entities';
import { CodePrefixEnum } from '@core/shared/utils/enums';
import { generateCode } from '@core/shared/utils/helpers';

@EventSubscriber()
export class Usersubscriber implements EntitySubscriberInterface<Users> {
  // constructor(private dataSource: DataSource) {
  //   this.dataSource.subscribers.push(this);
  // }
  /**
   * Indicates that this subscriber only listen to Location events.
   */
  listenTo() {
    return Users;
  }

  /**
   * Called after entity insertion.
   */
  async afterInsert(event: InsertEvent<Users>): Promise<void> {
    const repository = event.manager.getRepository(Users);
    const count = await repository.count();
    const model = event.entity;
    model.userCode = generateCode(count, CodePrefixEnum.USER, 6);
    await repository.save(model); // Save the updated entity
  }
}
