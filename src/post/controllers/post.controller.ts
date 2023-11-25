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
  // Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import {
  CreatePostDto,
  PaginationPostDto,
  UpdatePostDto,
} from '../dto/post.dto';
// import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }
  @Get('get-by-filter')
  getPostsByFilter(@Query() { page, limit }: PaginationPostDto) {
    return this.postService.getPostsByFilter(page, limit);
  }
  @Get('get-by-id/:id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }
  // // get post by query params(id)
  // @Get('get-by-id-query-param')
  // async getPostByIdQueryParam(@Query('post_id') post_id: string) {
  //   return this.postService.getPostByIdQueryParam(post_id);
  // }
  @Get('get-by-query/:id')
  async getPostByQuery(@Param('id') id: string) {
    return this.postService.getPostByQuery(id);
    // return this.queryBus.execute(new GetPostQuery(id));
  }
  @Get('get/category')
  async getByCategory(@Query('category_id') category_id: string) {
    return await this.postService.getByCategory(category_id);
  }
  @Get('get/categories')
  async getByCategories(@Query('category_id') category_id: [string]) {
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
  async createPost(@Req() req: any, @Body() post: CreatePostDto) {
    return await this.postService.createPost(req.user, post);
  }
  @Post('create-by-command')
  @UseGuards(AuthGuard('jwt'))
  async createPostByCommand(@Req() req: any, @Body() post: CreatePostDto) {
    return await this.postService.createPostByCommand(req.user, post);
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
  @UseGuards(AuthGuard('jwt'))
  async updatePost(
    @Param('id') id: string,
    @Req() req: any,
    @Body() post: UpdatePostDto,
  ) {
    return await this.postService.updatePost(id, req.user, post);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deletePost(@Param('id') id: string, @Req() req: any) {
    return await this.postService.deletePost(id, req.user);
  }
}
