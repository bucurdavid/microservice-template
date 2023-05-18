import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { AddTagDto } from './entities/dto/create.tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async create(createUserDto: AddTagDto): Promise<Tag> {
    const { identifier, tag } = createUserDto;

    const existingTag = await this.tagRepository.findOne({
      where: { identifier, tag },
    });

    if (existingTag) {
      throw new HttpException(
        `Tag '${tag}' already exists for identifier '${identifier}'`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newTag = new Tag();
    newTag.identifier = identifier!;
    newTag.tag = tag!;

    return this.tagRepository.save(newTag);
  }

  async createMultiple(addTagDtos: AddTagDto[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    for (const addTagDto of addTagDtos) {
      const { identifier, tag } = addTagDto;

      // Check if the tag already exists for the given identifier
      const existingTag = await this.tagRepository.findOne({
        where: { identifier, tag },
      });

      if (existingTag) {
        continue; // Skip adding the duplicate tag
      }

      const newTag = new Tag();
      newTag.identifier = identifier!;
      newTag.tag = tag!;

      const savedTag = await this.tagRepository.save(newTag);
      tags.push(savedTag);
    }

    return tags;
  }

  async findAll(): Promise<string[]> {
    const tags = await this.tagRepository.find();
    const uniqueTags = [...new Set(tags.map((tag) => tag.tag))];
    return uniqueTags.filter((tag) => tag !== undefined) as string[];
  }

  async findOne(id: number): Promise<Tag | null> {
    return await this.tagRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findIdentifiersWithTags(tags: string[]): Promise<string[]> {
    const identifiers = await this.tagRepository
      .createQueryBuilder('tag')
      .select('tag.identifier', 'identifier')
      .where('tag.tag IN (:...tags)', { tags })
      .groupBy('tag.identifier')
      .getRawMany();

    return identifiers.map((result) => result.identifier);
  }

  async findIdentifiersWithTagsList(
    identifiers: string[],
  ): Promise<Record<string, string[]>> {
    const identifiersWithTags: Record<string, string[]> = {};

    const tags = await this.tagRepository.find({
      where: {
        identifier: In(identifiers),
      },
    });

    tags.forEach((tag) => {
      if (tag.identifier! in identifiersWithTags) {
        identifiersWithTags[tag.identifier!].push(tag.tag!);
      } else {
        identifiersWithTags[tag.identifier!] = [tag.tag!];
      }
    });

    return identifiersWithTags;
  }

  async removeTag(identifier: string, tag: string): Promise<void> {
    await this.tagRepository.delete({ identifier, tag });
  }
}
