import { Controller, Delete, HttpException, HttpStatus, HttpCode, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'src/prisma.service';

@ApiTags('')
@Controller('customers')
export class DeleteCustomerController {
  constructor(private readonly prismaService: PrismaService) {}

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '',
  })
  @ApiOperation({ operationId: 'deleteCustomer' })
  @HttpCode(204)
  async execute(@Param('id') id: string): Promise<void> {
    const result = await this.prismaService.customer.findUnique({
      where: { id: id },
    });
    if (!result) throw new HttpException('Customer Not Found', HttpStatus.NOT_FOUND);
    await this.prismaService.customer.delete({ where: { id: id } });
  }
}
