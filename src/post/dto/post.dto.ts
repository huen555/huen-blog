import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;
  description: string;
  content: string;
  user: any;
  categories: [string];
}

export class UpdatePostDto {
  @IsNotEmpty()
  title: string;
  description: string;
  content: string;
}

export class PaginationPostDto {
  @IsNotEmpty()
  page: number;
  @IsNotEmpty()
  limit: number;
}
