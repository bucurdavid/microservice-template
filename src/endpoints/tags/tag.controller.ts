import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { TagsService } from './tag.service';
import { AddTagDto } from './entities/dto/create.tag.dto';
import { Tag } from './entities/tag.entity';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller()
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post('/addTag')
  create(@Body() addTagDto: AddTagDto): Promise<Tag> {
    return this.tagsService.create(addTagDto);
  }

  @Post('/addTags')
  @ApiOperation({ summary: 'Create multiple tags' })
  @ApiBody({ type: [AddTagDto] })
  @ApiResponse({
    status: 200,
    description: 'Tags created successfully',
    type: [Tag],
  })
  createMultiple(@Body() addTagDtos: AddTagDto[]): Promise<Tag[]> {
    return this.tagsService.createMultiple(addTagDtos);
  }

  @Get('/tags')
  findAll(): Promise<string[]> {
    return this.tagsService.findAll();
  }

  @Get('/identifiersByTags') // Updated endpoint path
  @ApiOperation({
    summary: 'Find identifiers for given tags',
    description: 'Retrieves identifiers associated with the provided tags',
  })
  @ApiQuery({
    name: 'tags',
    type: String,
    required: true,
    description: 'Comma-separated string of tags to search for',
    explode: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Array of identifiers found',
    type: String,
    isArray: true,
  })
  async findIdentifiersByTags(
    @Query('tags') tagsString: string,
  ): Promise<string[]> {
    const tags = tagsString.split(',').map((tag) => tag.trim());
    return this.tagsService.findIdentifiersWithTags(tags);
  }

  @Get('/tagsForIdentifiers')
  @ApiOperation({
    summary: 'Find tags for given identifiers',
    description: 'Retrieves tags associated with the provided identifiers',
  })
  @ApiQuery({
    name: 'identifiers',
    type: String,
    required: true,
    description: 'Comma-separated string of identifiers to search for',
    explode: false,
  })
  async findTagsForIdentifiers(
    @Query('identifiers') identifiers: string,
  ): Promise<Record<string, string[]>> {
    const identifiersList = identifiers.split(',').map((id) => id.trim());

    return this.tagsService.findIdentifiersWithTagsList(identifiersList);
  }

  @Get('/identifiers/:tag')
  @ApiOperation({
    summary: 'Find identifiers for a specific tag',
    description: 'Retrieves identifiers associated with a specific tag',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of identifiers found',
    type: String,
    isArray: true,
  })
  async findIdentifiersForTag(@Param('tag') tag: string): Promise<string[]> {
    return this.tagsService.findIdentifiersForTag(tag);
  }

  @Delete('removeTag')
  @ApiOperation({ summary: 'Remove a tag from an identifier' })
  @ApiResponse({ status: 200, description: 'Tag removed successfully' })
  @ApiQuery({ name: 'identifier', required: true })
  @ApiQuery({ name: 'tag', required: true })
  async removeTag(
    @Query('identifier') identifier: string,
    @Query('tag') tag: string,
  ): Promise<void> {
    return this.tagsService.removeTag(identifier, tag);
  }
}
