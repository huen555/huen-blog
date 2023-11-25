import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { PostRepository } from '../repositories/post.repository';
import { CategoryRepository } from '../repositories/category.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}
  async execute(command: CreatePostCommand) {
    command.createPostDto.user = {
      userId: command.user._id,
      name: command.user.name,
      email: command.user.email,
    };
    const new_post = await this.postRepository.create(command.createPostDto);
    if (command.createPostDto.categories) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: command.createPostDto.categories },
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
}
