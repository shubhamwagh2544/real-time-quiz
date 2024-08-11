import { Socket } from 'socket.io';
import { QuizManager } from './QuizManager';

export class UserManager {
    private users: {
        roomId: string;
        socket: Socket;
    }[];
    private quizManager;

    constructor() {
        this.users = [];
        this.quizManager = new QuizManager();
    }

    addUser(roomId: string, socket: Socket) {
        this.users.push({
            roomId,
            socket,
        });
        this.createHandlers(roomId, socket);
    }

    createHandlers(roomId: string, socket: Socket) {
        socket.on('join', (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            socket.emit('init', {
                userId,
                state: this.quizManager.getCurrentState(roomId),
            });
        });
        socket.on('join_admin', (data) => {
            const userId = this.quizManager.addUser(data.roomId, data.name);
            if (data.password !== 'ADMIN_PASSWORD') {
                console.log('wrong admin password');
                return;
            }
            socket.emit('admin_init', {
                userId,
                state: this.quizManager.getCurrentState(roomId),
            });
            socket.on('create_quiz', (data) => {
                this.quizManager.addQuiz(data.roomId);
            });
            socket.on('create_problem', (data) => {
                this.quizManager.addProblem(roomId, data.problem);
            });
            socket.on('next', (data) => {
                this.quizManager.next(roomId);
            });
        });

        socket.on('submit', (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            // todo: roomId ?
            const roomId = data.roomId;
            if (submission != 0 || submission != 1 || submission != 2 || submission != 3) {
                console.error('issue while getting input: ', submission);
                return;
            }
            this.quizManager.submit(userId, roomId, problemId, submission);
        });
    }
}
