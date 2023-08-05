export default interface SubscriberInterface {
  addSubscriber(subscriber): Promise<any>;
  getAllSubscribers(params: NonNullable<unknown>): Promise<{ data: [] }>;
}
