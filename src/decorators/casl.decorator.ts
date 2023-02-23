import { AnyMongoAbility, InferSubjects } from '@casl/ability';
import { SetMetadata } from '@nestjs/common';
import { Action } from 'src/enum/action.enum';

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum CHECK_POLICIES_KEY {
  HANDLER = 'CHECK_POLICIES_HANDLER',
  CAN = 'CHECK_POLICIES_CAN',
  CANNOT = 'CHECK_POLICIES_CANNOT',
}

export type PolicyHandlerCallback = (ability: AnyMongoAbility) => boolean;

export type CaslHandlerType = PolicyHandlerCallback | PolicyHandlerCallback[];

// GUARDS -> routes meta -> @CheckPolicies @Can @Cannot

// @CheckPolicies -> handler -> ability=> boolean
export const CheckPolices = (...handlers: PolicyHandlerCallback[]) => SetMetadata(CHECK_POLICIES_KEY.HANDLER, handlers);

// @Can -> Action, Subject, Conditions
export const Can = (action: Action, subject: InferSubjects<any>, conditions?: any) =>
  SetMetadata(CHECK_POLICIES_KEY.CAN, (ability: AnyMongoAbility) => ability.can(action, subject, conditions));

// @Cannot -> Action, Subject, Conditions
export const Cannot = (action: Action, subject: InferSubjects<any>, conditions?: any) =>
  SetMetadata(CHECK_POLICIES_KEY.CANNOT, (ability: AnyMongoAbility) => ability.cannot(action, subject, conditions));
