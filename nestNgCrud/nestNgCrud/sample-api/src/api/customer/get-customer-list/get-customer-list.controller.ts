import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetCustomer } from './get-customer-list-response';
import { ErrorResponseModel } from 'src/api/api.exception';
import { PrismaService } from '@src/prisma.service';

@ApiTags('')
@Controller('customers')
export class GetCustomerListController {
  constructor(private readonly prismaService: PrismaService) { }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'List of Customer', type: [GetCustomer] })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No Customer found', type: ErrorResponseModel })
  @ApiOperation({ operationId: 'getCustomerList' })
  @HttpCode(200)
  async execute(): Promise<GetCustomer[]> {
    const result = await this.prismaService.customer.findMany({});
    const response = result.map((x) => {
      return {
        id: x.id,
        firstName: x.firstName,
        lastName: x.lastName,
        gender: x.gender,
        address: x.address,
      };
    });
    return response;
  }
}
