export interface Alarm {
  id: string;
  title: string;
  time: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface AlarmRoom {
  id: string;
  alarms: Alarm[];
  users: User[];
  maxUsers: number;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface AlarmNotification {
  alarmId: string;
  title: string;
  time: string;
  type: 'trigger' | 'add' | 'remove' | 'update';
}