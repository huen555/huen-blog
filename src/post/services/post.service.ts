import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { PostRepository } from '../repositories/post.repository';
import { User } from 'src/user/models/user.model';
import { CategoryRepository } from '../repositories/category.repository';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { GetPostQuery } from '../queries/getPost.query';
import * as process from 'process';
// import { UserService } from 'src/user/services/user.service';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    // private readonly userService: UserService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async getAllPosts() {
    return this.postRepository.getByCondition({});
  }
  async getPostsByFilter(page: number, limit: number) {
    return this.postRepository.getByCondition({}, null, {
      sort: { _id: 1 },
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
    });
  }
  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      // (await post).populate({ path: 'user', select: 'name email' });
      //   .execPopulate();
      return post;
    } else {
      throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);
    }
  }

  // // get post by query params(id)
  // async getPostByIdQueryParam(post_id: string) {
  //   const post = await this.postRepository.findById(post_id);
  //   if (post) {
  //     // (await post).populate({ path: 'user', select: 'name email' });
  //     //   .execPopulate();
  //     return post;
  //   } else {
  //     throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);
  //   }
  // }

  async getPostByQuery(id: string) {
    return this.queryBus.execute(new GetPostQuery(id));
  }

  // // get user by id
  // async getUserById(post_id: string) {
  //   const post = await this.postRepository.findById(post_id);
  //   if (post) {
  //     // (await post).populate({ path: 'user', select: 'name email' });
  //     //   .execPopulate();
  //     return post.user;
  //   } else {
  //     throw new HttpException('Post not found!', HttpStatus.NOT_FOUND);
  //   }
  // }

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
    return `Successfully created post with id = ${new_post._id}`;
  }

  async createPostByCommand(user: User, post: CreatePostDto) {
    return await this.commandBus.execute(new CreatePostCommand(user, post));
  }

  async updatePost(post_id: string, user: User, data: UpdatePostDto) {
    const postDetail = await this.getPostById(post_id);
    if (
      user.email === postDetail.user.email ||
      user.email === process.env.ADMIN_MAIL
    ) {
      //check categories change
      if (
        JSON.stringify(postDetail.categories.sort()) !==
        JSON.stringify(data.categories.sort())
      ) {
        await this.categoryRepository.updateMany(
          { _id: { $in: postDetail.categories } },
          {
            $pull: {
              posts: post_id,
            },
          },
        );
        await this.categoryRepository.updateMany(
          { _id: { $in: data.categories } },
          {
            $push: {
              posts: post_id,
            },
          },
        );
      }
      await this.postRepository.findByIdAndUpdate(post_id, data);
      return `Successfully updated post with id = ${post_id}`;
    } else {
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
  }

  async deletePost(post_id: string, user: User) {
    const postDetail = await this.getPostById(post_id);
    if (
      user.email === postDetail.user.email ||
      user.email === process.env.ADMIN_MAIL
    ) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: postDetail.categories },
        },
        {
          $pull: {
            posts: post_id,
          },
        },
      );
      await this.postRepository.deleteOne(post_id);
      return `Successfully deleted post with id = ${post_id}`;
    } else {
      throw new HttpException('Unauthorized!', HttpStatus.UNAUTHORIZED);
    }
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
