import { PartialType } from '@nestjs/mapped-types';
import { AcceptInviteDto } from './create-invite.dto';

export class UpdateInviteDto extends PartialType(AcceptInviteDto) {}
