import { Container } from 'inversify';
import Types from '../types';
import Executable from '../interfaces/executable';

import SampleFeature from './sample';
import ISampleFeatureParams from './sample/params';
import ISampleFeatureResponse from './sample/response';

const container = new Container();

container
  .bind<Executable<ISampleFeatureParams, ISampleFeatureResponse>>(
    Types.SampleFeature,
  )
  .to(SampleFeature);

export default container;
