import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerResponse {
  @ApiProperty()
  id: string;
}
