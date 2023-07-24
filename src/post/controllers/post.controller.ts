import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { PostService } from '../services/post.service';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { Response } from 'express';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }
  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }
  @Post()
  async createPost(@Body() post: CreatePostDto, @Res() res: Response) {
    return (
      this.postService.createPost(post),
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
