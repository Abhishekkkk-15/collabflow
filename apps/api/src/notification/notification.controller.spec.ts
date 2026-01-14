import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;
  const mockNotificationService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    markAsRead: jest.fn(),
    remove: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get(NotificationService);
  });

  it('create notificaton for user', () => {});

  it('find user all notifications', async () => {
    const user = {
      id: '1',
    } as any;

    (service.findAll as jest.Mock).mockResolvedValue([
      { id: '1' },
      { id: '2' },
    ]);

    const result = await controller.findAll(user);
    expect(service.findAll).toHaveBeenCalledWith(user);
    expect(result).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('find one notification by id', async () => {
    const notificationId = '1';
    (service.findOne as jest.Mock).mockResolvedValue({ id: '1' });
    const result = await controller.findOne(notificationId);
    expect(service.findOne).toHaveBeenCalledWith(notificationId);
    expect(result).toEqual({ id: '1' });
  });

  it("mark all user's notification as read", async () => {
    const mockUser = { id: 'user-1' } as any;
    (service.markAsRead as jest.Mock).mockResolvedValue(undefined);
    const result = await controller.markAllAsRead(mockUser);
    expect(service.markAsRead).toHaveBeenCalledWith(mockUser);
    expect(result).toBeUndefined();
  });

  it("delete notification of given id's", async () => {
    const mockIds = { ids: ['1', '2'] };
    (service.remove as jest.Mock).mockResolvedValue(undefined);
    const result = await controller.remove(mockIds);
    expect(service.remove).toHaveBeenCalledWith(mockIds.ids);
    expect(result).toBeUndefined();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
