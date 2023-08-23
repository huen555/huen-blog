import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import {
  CreatePostDto,
  PaginationPostDto,
  UpdatePostDto,
} from '../dto/post.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { GetPostQuery } from '../queries/getPost.query';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  @Get()
  getAllPosts(@Query() { page, limit }: PaginationPostDto) {
    return this.postService.getAllPosts(page, limit);
  }
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Get('get-by-query/:id')
  async getPostByQuery(@Param('id') id: string) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  @Get('get/category')
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }

  @Get('get/categories')
  async getByCategories(@Query('category_id') category_id) {
    return await this.postService.getByCategories(category_id);
  }

  @Get('get-with-cache/:id')
  @UseInterceptors(CacheInterceptor)
  async getPostDetailWithCache(@Param('id') id: string) {
    console.log('Run here');
    return (await this.postService.getPostById(id)).toJSON();
  }

  @Get('cache/demo/get-cache')
  async demoGetCache() {
    return this.cacheManager.get('user');
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(
    @Req() req: any,
    @Body() post: CreatePostDto,
    @Res() res: Response,
  ) {
    return (
      await this.postService.createPost(req.user, post),
      res.json({ message: 'Create new post successfully!' })
    );
  }

  @Post('create-by-command')
  @UseGuards(AuthGuard('jwt'))
  async createPostByCommand(
    @Req() req: any,
    @Body() post: CreatePostDto,
    @Res() res: Response,
  ) {
    return (
      await this.commandBus.execute(new CreatePostCommand(req.user, post)),
      res.json({ message: 'Create new post successfully!' })
    );
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('cache/demo/set-cache')
  async demoSetCache(@Req() req: any) {
    await this.cacheManager.set('user', {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    });

    return true;
  }
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() post: UpdatePostDto,
    @Res() res: Response,
  ) {
    return (
      await this.postService.updatePost(id, post),
      res.json({ message: 'Post updated successfully!' })
    );
  }
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Res() res: Response) {
    return (
      await this.postService.deletePost(id),
      res.json({ message: 'Post deleted successfully!' })
    );
  }
}
