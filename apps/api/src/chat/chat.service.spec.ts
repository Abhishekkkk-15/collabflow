import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { parseRoomId } from '../common/utils/parserRoomId';
import { prisma } from '@collabflow/db';
import { ForbiddenException } from '@nestjs/common';
jest.mock('@collabflow/db', () => ({
  prisma: {
    $transaction: jest.fn(),
    chatMessage: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    chatReadState: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('../common/utils/parserRoomId', () => ({
  parseRoomId: jest.fn(),
}));

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatService],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should return paginated message for a room', async () => {
    (parseRoomId as jest.Mock).mockReturnValue({ slug: 'room-1' });
    (prisma.$transaction as jest.Mock).mockResolvedValue([
      [{ id: 'm1' }, { id: 'm2' }],
      12,
    ]);
    const result = await service.getMessages('room-1', 1, 5);
    expect(parseRoomId).toHaveBeenCalledWith('room-1');
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(result).toEqual({
      messages: [{ id: 'm1' }, { id: 'm2' }],
      page: 1,
      totalPages: Math.ceil(12 / 5),
    });
  });

  it('should update chat message if user is sender ', async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValue({
      id: 'c-1',
      senderId: 'user-2',
    });
    (prisma.chatMessage.update as jest.Mock).mockResolvedValue({
      id: 'c-1',
      content: 'updated',
    });
    const mockUser = { id: 'user-2' };
    const result = await service.updateChat('c-1', mockUser.id, 'updated');
    expect(prisma.chatMessage.update).toHaveBeenCalledWith({
      where: {
        id: 'c-1',
      },
      data: {
        content: 'updated',
      },
    });
    expect(result.content).toBe('updated');
  });

  it('should throws forbiddenException if user is not a sender', async () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValue({
      id: 'c-1',
      senderId: 'user-1',
    });
    expect(service.updateChat('c-1', 'user-2', 'hi')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw forbiddenExeption if user cannot delete chat', () => {
    (prisma.chatMessage.findUnique as jest.Mock).mockResolvedValue({
      id: 'c-1',
      senderId: 'user-1',
    });
    const mockDataOfNotSender = { id: 'user-2' };
    expect(service.deleteChat('c-1', mockDataOfNotSender.id)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should delete chat message if user is sender', async () => {
    (prisma.chatMessage.update as jest.Mock).mockResolvedValue({
      id: 'c-1',
      content: '[deleted]',
    });

    const result = await service.deleteChat('c-1', 'user-1');
    expect(prisma.chatMessage.update).toHaveBeenCalledWith({
      where: {
        id: 'c-1',
      },
      data: {
        content: '[deleted]',
      },
    });
    expect(result).toEqual({
      id: 'c-1',
      content: '[deleted]',
    });
  });

  it('should mark chat as read for the user', async () => {
    (prisma.chatReadState.upsert as jest.Mock).mockResolvedValue({
      roomKey: 'projec-1',
      userId: 'user-1',
    });
    const result = await service.markAsRead('user-1', 'project-1');
    expect(result.userId).toEqual('user-1');
  });

  it('should return unread message count', async () => {
    (parseRoomId as jest.Mock).mockResolvedValue({ slug: 'room-1' });
    (prisma.chatReadState.findUnique as jest.Mock).mockResolvedValue({
      lastReadAt: new Date('2025-12-12'),
    });
    (prisma.chatMessage.count as jest.Mock).mockResolvedValue(3);
    const result = await service.getUnreadCount('user-1', 'room-1');
    expect(result).toBe(3);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
