import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GetCustomer {
  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly id: string;
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
