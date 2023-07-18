import { Model, FilterQuery, QueryOptions, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(private readonly model: Model<T>) {}

  // Create single or multiple
  async create(doc): Promise<any> {
    console.log(doc);
    return await this.model.insertMany(doc);
  }

  async findById(id: string, option?: QueryOptions): Promise<T> {
    return this.model.findById(id, option);
  }

  // Find by Condition return only one
  // async findByCondition(
  //   filter,
  //   field?: any | null,
  //   option?: any | null,
  //   populate?: any | null,
  // ) {
  //   return this.model.findOne(filter, field, option).populate(populate);
  // }

  async getByCondition(
    filter,
    field?: any | null,
    option?: any | null,
    populate?: any | null,
  ): Promise<T[]> {
    return this.model.find(filter, field, option).populate(populate);
  }

  // async findAll(): Promise<T[]> {
  //   return this.model.find();
  // }

  // async aggregate(option: any) {
  //   return this.model.aggregate(option);
  // }

  // async populate(result: T[], option: any) {
  //   return await this.model.populate(result, option);
  // }

  async deleteOne(id: string) {
    return this.model.deleteOne({ _id: id } as FilterQuery<T>);
  }

  // async deleteMany(id: string[]) {
  //   return this.model.deleteMany({ _id: { $in: id } } as FilterQuery<T>);
  // }

  // async deleteByCondition(filter) {
  //   return this.model.deleteMany(filter);
  // }

  // async findByConditionAndUpdate(filter, update) {
  //   return this.model.findOneAndUpdate(filter as FilterQuery<T>, update);
  // }

  // async updateMany(filter, update, option?: any | null) {
  //   return this.model.updateMany(filter, update, option);
  // }

  async findByIdAndUpdate(id, update) {
    return this.model.findByIdAndUpdate(id, update);
  }
}
