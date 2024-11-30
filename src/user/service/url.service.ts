import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UrlRepository } from '../repository/url.repository';
import { CreateLinkDto } from '../dto/createLink.dto';
import { Url } from '../schema/url.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UrlService {
  constructor(
    private readonly _urlRepository: UrlRepository,
    @InjectModel(Url.name)
    private _urlModel: Model<Url>,
  ) {}

  private async generateUniqueShortLink(customUrl?: string): Promise<string> {
    if (customUrl) {
      const existingLink =
        await this._urlRepository.findExistingLink(customUrl);

      if (existingLink) {
        const suffix = Math.random().toString(36).substring(2, 6);
        return `${customUrl}-${suffix}`;
      }
      return customUrl;
    }

    while (true) {
      const shortLink = Math.random().toString(36).substring(2, 6);
      const existingLink = await this._urlModel.findOne({
        shortenedLink: shortLink,
      });

      if (!existingLink) {
        return shortLink;
      }
    }
  }

  async createLink(userId: string, createLinkDto: CreateLinkDto) {
    const existingLink = await this._urlRepository.findByOriginalUrl(
      createLinkDto.longUrl,
    );

    if (existingLink) {
      throw new ConflictException('A short link already exists for this URL');
    }
    const shortenedLink = await this.generateUniqueShortLink(
      createLinkDto.customUrl,
    );
    const link = await this._urlRepository.createLink(
      userId,
      createLinkDto,
      shortenedLink,
    );
    return link;
  }

  async getUserLinks(userId: Types.ObjectId, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const links = await this._urlRepository.findUserLinks(userId, skip, limit);
    const total = await this._urlRepository.countUserLinks(userId);
    return { links, total };
  }

  async findOriginalUrl(id: string) {
    return await this._urlRepository.findOriginalUrl(id);
  }

  async deleteLink(id: string) {
    const deletedLink = await this._urlModel.findByIdAndDelete(id);
    if (!deletedLink) {
      throw new NotFoundException('Link not found');
    }
    return { message: 'Link deleted successfully' };
  }
}
