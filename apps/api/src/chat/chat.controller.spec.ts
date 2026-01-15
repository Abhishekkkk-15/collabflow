import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

describe('ChatController', () => {
  let controller: ChatController;
  let service: jest.Mocked<ChatService>;

  const mockChatService = {
    getMessages: jest.fn(),
    updateChat: jest.fn(),
    deleteChat: jest.fn(),
    markAsRead: jest.fn(),
    getUnreadCount: jest.fn(),
  };
  const mockUser = {
    id: 'user-1',
  } as any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    service = module.get(ChatService);
  });

  it('returns paginated chat messages for a room', async () => {
    (service.getMessages as jest.Mock).mockResolvedValue({
      messages: [{ id: 'm1' }],
      page: 1,
      totalPages: 2,
    });

    const result = await controller.getChats('room-1', '1', '10');

    expect(service.getMessages).toHaveBeenCalledWith('room-1', 1, 10);
    expect(result).toEqual({
      messages: [{ id: 'm1' }],
      page: 1,
      totalPages: 2,
    });
  });

  it('allows user to update their chat message', async () => {
    (service.updateChat as jest.Mock).mockResolvedValue({
      id: 'c1',
      content: 'updated',
    });

    const result = await controller.updateChat('c1', mockUser, {
      content: 'updated',
    });

    expect(service.updateChat).toHaveBeenCalledWith(
      'c1',
      mockUser.id,
      'updated',
    );

    expect(result.content).toBe('updated');
  });

  it('deletes a chat message by id', async () => {
    (service.deleteChat as jest.Mock).mockResolvedValue({
      id: 'c1',
      content: '[deleted]',
    });

    const result = await controller.deleteChat('c1', mockUser);

    expect(service.deleteChat).toHaveBeenCalledWith('c1', mockUser.id);

    expect(result.content).toBe('[deleted]');
  });

  it('marks chat room as read for the user', async () => {
    (service.markAsRead as jest.Mock).mockResolvedValue(undefined);

    const result = await controller.markAsRead('room-1', mockUser);

    expect(service.markAsRead).toHaveBeenCalledWith(mockUser.id, 'room-1');

    expect(result).toBeUndefined();
  });

  it('returns unread message count for a room', async () => {
    (service.getUnreadCount as jest.Mock).mockResolvedValue(5);

    const result = await controller.getUnread('room-1', mockUser);

    expect(service.getUnreadCount).toHaveBeenCalledWith(mockUser.id, 'room-1');

    expect(result).toBe(5);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
