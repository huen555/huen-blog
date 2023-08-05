import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostRepository } from '../repositories/post.repository';
import { User } from 'src/user/models/user.model';
import { CategoryRepository } from '../repositories/category.repository';
// import { UserService } from 'src/user/services/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    // private readonly userService: UserService,
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async getAllPosts(page: number, limit: number) {
    return this.postRepository.getByCondition({}, null, {
      sort: { _id: 1 },
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
    });
  }
  async getPostById(post_id: string) {
    const post = this.postRepository.findById(post_id);
    if (post) {
      // (await post).populate({ path: 'user', select: 'name email' });
      //   .execPopulate();
      return post;
    } else {
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);
    }
  }
  async createPost(user: User, post: CreatePostDto) {
    // post.user = user._id;
    post.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
    };
    const new_post = await this.postRepository.create(post);
    if (post.categories) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: post.categories },
        },
        {
          $push: {
            posts: new_post._id,
          },
        },
      );
    }
    return new_post;
  }

  async updatePost(post_id: string, data: UpdatePostDto) {
    return await this.postRepository.findByIdAndUpdate(post_id, data);
  }
  async deletePost(post_id: string) {
    return await this.postRepository.deleteOne(post_id);
  }

  async getByCategory(category_id: string) {
    return await this.postRepository.getByCondition({
      categories: {
        $elemMatch: { $eq: category_id },
      },
    });
  }

  async getByCategories(category_id: [string]) {
    return await this.postRepository.getByCondition({
      categories: {
        $all: category_id,
      },
    });
  }
}
