import { AllowedSubmissions, Quiz } from '../Quiz';
import { IoManager } from './IoManager';

let globalProblemId = 0;

export class QuizManager {
    private quizzes: Quiz[];

    constructor() {
        this.quizzes = [];
    }

    start(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            console.log('quiz not found');
            return;
        }
        quiz.start();
    }

    addProblem(
        roomId: string,
        problem: {
            title: string;
            description: string;
            image: string;
            options: {
                id: number;
                title: string;
            }[];
            answer: AllowedSubmissions;
        }
    ) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            console.log('quiz not found');
            return;
        }
        quiz.addProblem({
            ...problem,
            id: (globalProblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: [],
            option: { id: 0, title: 'test option' },
        });
    }

    next(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            console.log('quiz not found');
            return;
        }
        quiz.next();
    }

    addUser(roomId: string, name: string) {
        return this.getQuiz(roomId)?.addUser(name);
    }

    submit(userId: string, roomId: string, problemId: string, submission: 0 | 1 | 2 | 3) {
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
    }

    getQuiz(roomId: string) {
        return this.quizzes.find((quiz) => quiz.roomId === roomId) ?? null;
    }

    getCurrentState(roomId: string) {
        const quiz = this.quizzes.find((x) => x.roomId === roomId);
        if (!quiz) {
            console.log('quiz not found');
            return;
        }
        return quiz.getCurrentState();
    }

    addQuiz(roomId: string) {
        const quiz = new Quiz(roomId);
        this.quizzes.push(quiz);
    }
}
