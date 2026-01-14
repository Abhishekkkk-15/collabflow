import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { prisma } from '@collabflow/db';

jest.mock('@collabflow/db', () => ({
  prisma: {
    notification: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

describe('NotificationService', () => {
  let service: NotificationService;

  let mockUser = {
    id: 'user-1',
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return all notification's for a user", async () => {
    const mockNotificaton = [{ id: '1' }, { id: '12' }];

    (prisma.notification.findMany as jest.Mock).mockResolvedValue(
      mockNotificaton,
    );
    const result = await service.findAll(mockUser);
    expect(prisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: mockUser.id },
      }),
    );
    expect(result).toEqual(mockNotificaton);
  });

  it('should return notification by id', async () => {
    const notificationId = '1';
    const mockNotificaton = {
      id: '1',
      userId: 'user-1',
      actorId: 'user-2',
      workspaceId: 'ws-1',
      projectId: 'pj-1',
      type: 'GENERAL',
      title: 'General Notification',
      body: {} as any,
      link: 'dfdaf',
      isRead: true,
      openedAt: '12341243',
      createdAt: '12312312',
    };
    (prisma.notification.findUnique as jest.Mock).mockResolvedValue(
      mockNotificaton,
    ); // When any code calls findUnique, return this object
    const result = await service.findOne(notificationId);
    expect(prisma.notification.findUnique).toHaveBeenLastCalledWith({
      where: {
        id: notificationId,
      },
    });
    expect(result).toEqual(mockNotificaton);
  });

  it('should mark all unread notification as read for user', async () => {
    const mockUser = { id: 'user-1' } as any;
    (prisma.notification.updateMany as jest.Mock).mockResolvedValue({
      count: 3,
    });
    const result = await service.markAsRead(mockUser);
    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: {
        AND: [{ userId: mockUser.id }, { isRead: false }],
      },
      data: {
        isRead: true,
      },
    });
    expect(result).toBeUndefined();
  });

  it("should remove user's notification", async () => {
    const mockNotificationIds = ['1', '2'];
    (prisma.notification.deleteMany as jest.Mock).mockResolvedValue(2);
    const result = await service.remove(mockNotificationIds);
    expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: mockNotificationIds,
        },
      },
    });
    expect(result).toBeUndefined();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
