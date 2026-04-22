// This subscriber is disabled because the Products entity has been removed.
/*
import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
} from 'typeorm';
import { Products } from '../entities';
import { CodePrefixEnum } from '@core/shared/utils/enums';
import { generateCode } from '@core/shared/utils/helpers';

@EventSubscriber()
export class Productsubscriber implements EntitySubscriberInterface<Products> {
  listenTo() {
    return Products;
  }

  async afterInsert(event: InsertEvent<Products>): Promise<void> {
    const repository = event.manager.getRepository(Products);
    const count = await repository.count();
    const model = event.entity;
    model.productCode = generateCode(count, CodePrefixEnum.PRODUCT, 8);
    model.productBarcode = model.productBarcode ?? model.productCode;
    await repository.save(model); // Save the updated entity
  }
}
*/
