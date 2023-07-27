import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }
  @Get(':id')
  async getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }
  @Get('get/category')
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }

  @Get('get/categories')
  async getByCategories(@Query('category_ids') category_ids) {
    return await this.postService.getByCategories(category_ids);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createPost(
    @Req() req: any,
    @Body() post: CreatePostDto,
    @Res() res: Response,
  ) {
    return (
      this.postService.createPost(req.user, post),
      res.json({ message: 'Create new post successfully!' })
    );
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() post: UpdatePostDto,
    @Res() res: Response,
  ) {
    return (
      this.postService.updatePost(id, post),
      res.json({ message: 'Post updated successfully!' })
    );
  }
  @Delete(':id')
  async deletePost(@Param('id') id: string, @Res() res: Response) {
    return (
      this.postService.deletePost(id),
      res.json({ message: 'Post deleted successfully!' })
    );
  }
}
