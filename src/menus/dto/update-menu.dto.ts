import { PartialType } from '@nestjs/mapped-types';

import { CreateMenuDto } from './create-menu.dto';

export class UpdateRoleDto extends PartialType(CreateMenuDto) {}
