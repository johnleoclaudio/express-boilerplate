import 'reflect-metadata';
import { Container } from 'inversify';

import servicesContainer from './services/container.ioc';
import featuresContainer from './features/container.ioc';
import dbContainer from './db/container.ioc';
import observersContainer from './observers/container.ioc';

const container = new Container();

export default [
  servicesContainer,
  featuresContainer,
  dbContainer,
  observersContainer,
].reduce((acc: any, currentContainer: any) => {
  return Container.merge(acc, currentContainer);
}, container);
