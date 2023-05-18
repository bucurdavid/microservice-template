import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddTagDto {
  @ApiPropertyOptional()
  identifier?: string;

  @ApiPropertyOptional()
  tag?: string;
}
