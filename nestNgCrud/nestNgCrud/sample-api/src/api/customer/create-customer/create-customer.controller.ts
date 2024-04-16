import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerResponse } from './create-customer-response';
import { CreateCustomerRequest } from './create-customer-request';
import { ErrorResponseModel } from 'src/api/api.exception';
import { PrismaService } from 'src/prisma.service';

@ApiTags('')
@Controller('customers')
export class CreateCustomerController {
  constructor(private readonly prismaService: PrismaService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.OK, description: '', type: CreateCustomerResponse })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '', type: ErrorResponseModel })
  @ApiOperation({ operationId: 'createCustomer' })
  @HttpCode(201)
  async execute(@Body() request: CreateCustomerRequest): Promise<CreateCustomerResponse> {
    const result = await this.prismaService.customer.create({
      data: {
        firstName: request.firstName,
        lastName: request.lastName,
        gender: request.gender,
        address: request.address,
      },
    });
    return {
      id: result.id,
    };
  }
}
