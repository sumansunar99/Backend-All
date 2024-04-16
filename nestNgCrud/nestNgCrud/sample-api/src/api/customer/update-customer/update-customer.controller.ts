import { Body, Controller, HttpCode, HttpStatus, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateCustomerRequest } from './update-customer-request';
import { PrismaService } from 'src/prisma.service';

@ApiTags('')
@Controller('customers')
export class UpdateCustomerController {
  constructor(private readonly prismaService: PrismaService) {}

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @ApiOperation({ operationId: 'updateCustomer' })
  @HttpCode(204)
  async execute(@Param('id') id: string, @Body() request: UpdateCustomerRequest): Promise<void> {
    await this.prismaService.customer.update({
      where: {
        id: id,
      },
      data: {
        firstName: request.firstName,
        lastName: request.lastName,
        gender: request.gender,
        address: request.address,
      },
    });
  }
}
