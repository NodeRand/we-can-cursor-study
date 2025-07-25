const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

const rooms = new Map();

const checkAlarms = () => {
    const now = new Date();

    rooms.forEach((room, roomId) => {
        room.alarms.forEach(alarm => {
            if (alarm.isActive && new Date(alarm.time) <= now) {
                io.to(roomId).emit('alarm-notification', {
                    alarmId: alarm.id,
                    title: alarm.title,
                    time: alarm.time,
                    type: 'trigger',
                });

                alarm.isActive = false;
                io.to(roomId).emit('room-updated', room);
            }
        });
    });
};

setInterval(checkAlarms, 1000);

io.on('connection', socket => {
    console.log('User connected:', socket.id);

    socket.on('join-room', ({ roomId, userName }) => {
        console.log(`Join room request: ${userName} -> ${roomId}`);

        if (!rooms.has(roomId)) {
            console.log(`Creating new room: ${roomId}`);
            rooms.set(roomId, {
                id: roomId,
                alarms: [],
                users: [],
                maxUsers: 5,
                createdAt: new Date(),
            });
        }

        const room = rooms.get(roomId);
        console.log(`Room state before join:`, {
            users: room.users.map(u => ({ id: u.id, name: u.name })),
            userCount: room.users.length,
        });

        if (room.users.length >= room.maxUsers) {
            console.log(`Room full: ${roomId}`);
            socket.emit('room-full');
            return;
        }

        const existingUser = room.users.find(user => user.name === userName);
        if (existingUser) {
            console.log(`User name already exists: ${userName}`);
            socket.emit('error', '이미 존재하는 사용자명입니다.');
            return;
        }

        const user = {
            id: socket.id,
            name: userName,
            joinedAt: new Date(),
        };

        room.users.push(user);
        socket.join(roomId);
        socket.roomId = roomId;
        socket.userName = userName;

        console.log(`User joined successfully:`, {
            socketId: socket.id,
            userName,
            roomId,
            totalUsers: room.users.length,
        });

        console.log(`Emitting room-updated to room: ${roomId}`, {
            users: room.users.map(u => ({ id: u.id, name: u.name })),
            userCount: room.users.length,
        });

        io.to(roomId).emit('room-updated', room);
        console.log(`${userName} joined room ${roomId}`);
    });

    socket.on('add-alarm', ({ roomId, alarm }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const newAlarm = {
            ...alarm,
            id: uuidv4(),
            createdAt: new Date(),
        };

        room.alarms.push(newAlarm);
        io.to(roomId).emit('room-updated', room);

        io.to(roomId).emit('alarm-notification', {
            alarmId: newAlarm.id,
            title: newAlarm.title,
            time: newAlarm.time,
            type: 'add',
        });
    });

    socket.on('remove-alarm', ({ roomId, alarmId }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const alarmIndex = room.alarms.findIndex(alarm => alarm.id === alarmId);
        if (alarmIndex === -1) return;

        const alarm = room.alarms[alarmIndex];

        if (alarm.createdBy !== socket.userName) {
            socket.emit('error', '본인이 등록한 알람만 삭제할 수 있습니다.');
            return;
        }

        room.alarms.splice(alarmIndex, 1);
        io.to(roomId).emit('room-updated', room);

        io.to(roomId).emit('alarm-notification', {
            alarmId: alarmId,
            title: alarm.title,
            time: alarm.time,
            type: 'remove',
        });
    });

    socket.on('toggle-alarm', ({ roomId, alarmId }) => {
        const room = rooms.get(roomId);
        if (!room) return;

        const alarm = room.alarms.find(alarm => alarm.id === alarmId);
        if (!alarm) return;

        alarm.isActive = !alarm.isActive;
        io.to(roomId).emit('room-updated', room);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);

        if (socket.roomId) {
            const room = rooms.get(socket.roomId);
            if (room) {
                room.users = room.users.filter(user => user.id !== socket.id);

                if (room.users.length === 0) {
                    rooms.delete(socket.roomId);
                    console.log(
                        `Room ${socket.roomId} deleted - no users left`,
                    );
                } else {
                    io.to(socket.roomId).emit('room-updated', room);
                }

                console.log(`${socket.userName} left room ${socket.roomId}`);
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
