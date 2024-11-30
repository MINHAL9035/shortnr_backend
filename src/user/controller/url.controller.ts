import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UrlService } from '../service/url.service';
import { CreateLinkDto } from '../dto/createLink.dto';
import { JwtUserGuard } from 'src/guards/jwtUserGuard';
@UseGuards(JwtUserGuard)
@Controller('user')
export class UrlController {
  constructor(private readonly _urlService: UrlService) {}

  @Post('createLink')
  async createLink(@Req() request, @Body() createLinkDto: CreateLinkDto) {
    const userId = request.user._id;
    const link = await this._urlService.createLink(userId, createLinkDto);
    return link;
  }

  @Get('getLinks')
  async getLinks(
    @Req() request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '5',
  ) {
    const userId = request.user._id;
    const pageNumber = Math.max(1, parseInt(page));
    const pageSize = Math.max(1, parseInt(limit));

    const links = await this._urlService.getUserLinks(
      userId,
      pageNumber,
      pageSize,
    );
    console.log(links);

    return links;
  }

  @Get('getOrgUrl')
  async getOriginalUrl(@Query('id') id: string) {
    const link = await this._urlService.findOriginalUrl(id);
    return link.originalLink;
  }

  @Delete(':id')
  async deleteLink(@Param('id') id: string) {
    return await this._urlService.deleteLink(id);
  }
}
