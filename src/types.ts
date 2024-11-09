import {
  AbstractModel as RolsterAbstractModel,
  Model as RolsterModel,
  ModelEditable as RolsterModelEditable,
  ModelHideable as RolsterModelHideable
} from '@rolster/vinegar';
import { ObjectLiteral } from 'typeorm';

export interface AbstractModel extends ObjectLiteral, RolsterAbstractModel {}

export interface ModelEditable extends ObjectLiteral, RolsterModelEditable {}

export interface ModelHideable extends ObjectLiteral, RolsterModelHideable {}

export interface Model extends ObjectLiteral, RolsterModel {}
