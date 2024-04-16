import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCustomerResponse } from './get-customer-response';
import { PrismaService } from 'src/prisma.service';

@ApiTags('')
@Controller('customers')
export class GetCustomerController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: '',
  })
  @ApiOperation({ operationId: 'getCustomer' })
  @HttpCode(200)
  async execute(@Param('id') id: string): Promise<GetCustomerResponse> {
    const result = await this.prismaService.customer.findUnique({
      where: { id: id },
    });
    return {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      gender: result.gender,
      address: result.address,
    } as GetCustomerResponse;
  }
}
