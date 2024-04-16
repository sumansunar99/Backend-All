import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerRequest {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly firstName: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly lastName?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly gender: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly address: string;
}
