import db from '@infrastructure/database/prisma';

interface ICreateQuoteRequest {
  currentUserId: string;
  bookId: string;
  topicId: string;
  content: string;
  language: string;
}

export default class CreateQuoteRequestUseCase {
  constructor() {}

  public async execute({ currentUserId, content, bookId, topicId, language }: ICreateQuoteRequest) {
    // --> check if book and topic exist
    const [isBookExist, isTopicExist] = await Promise.all([
      db.book.findUnique({
        select: { id: true },
        where: { id: bookId },
      }),
      db.topic.findUnique({
        select: { id: true },
        where: { id: topicId },
      }),
    ]);

    if (isBookExist === null) {
      throw new Error('You may not create a quote for this book because it does not exist.');
    }

    if (isTopicExist === null) {
      throw new Error('You may not create a quote for this topic because it does not exist.');
    }

    // --> create quote request
    const quoteRequest = await db.quoteRequest.create({
      select: {
        id: true,
        content: true,
        language: true,
        bookId: true,
        topicId: true,
      },
      data: {
        content,
        language,
        bookId,
        topicId,
        userId: currentUserId,
      },
    });

    return quoteRequest;
  }
}
