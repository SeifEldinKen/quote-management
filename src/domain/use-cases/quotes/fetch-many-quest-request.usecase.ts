import db from '@infrastructure/database/prisma';

interface IFetchManyQuoteRequest {
  currentUserId: string;
  pagination: {
    limit: number;
    page: number;
  };
}

export default class FetchManyQuoteRequestUseCase {
  constructor() {}

  public async execute({ currentUserId, pagination }: IFetchManyQuoteRequest) {
    const quoteRequests = await db.quoteRequest.findMany({
      select: {
        id: true,
        content: true,
        language: true,
        bookId: true,
        topicId: true,
        createdAt: true,
      },
      where: {
        userId: currentUserId,
      },
      orderBy: { createdAt: 'desc' },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });

    const totalQuoteRequests = await db.quoteRequest.count({
      where: {
        userId: currentUserId,
      },
    });

    return {
      quoteRequests,
      pagination: {
        totalQuoteRequests,
        currentPage: pagination.page,
        totalPages: Math.ceil(totalQuoteRequests / pagination.limit),
      },
    };
  }
}
