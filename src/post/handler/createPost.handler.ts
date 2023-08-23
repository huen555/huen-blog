import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { PostRepository } from '../repositories/post.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(private postRepository: PostRepository) {}

  async execute(command: CreatePostCommand) {
    command.createPostDto.user = {
      userId: command.user._id,
      name: command.user.name,
      email: command.user.email,
    };
    return await this.postRepository.create(command.createPostDto);
  }
}
