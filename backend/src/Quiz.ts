import { IoManager } from './managers/IoManager';

const PROBLEM_TIME_SEC = 20;
export type AllowedSubmissions = 0 | 1 | 2 | 3;

interface User {
    id: string;
    name: string;
    points: number;
}

interface Problem {
    id: string;
    title: string;
    description: string;
    image: string;
    answer: AllowedSubmissions;
    startTime: number;
    option: {
        id: number;
        title: string;
    };
    submissions: Submission[];
}

interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmissions;
}

export class Quiz {
    public roomId: string;
    private hasStarted: boolean;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private currentState: 'leaderboard' | 'question' | 'not_started' | 'ended';

    constructor(roomId: string) {
        this.roomId = roomId;
        this.hasStarted = false;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = 'not_started';
    }

    addProblem(problem: Problem) {
        this.problems.push(problem);
    }

    start() {
        this.hasStarted = true;
        this.setActiveProblem(this.problems[0]);
    }

    setActiveProblem(problem: Problem) {
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        IoManager.getIo().emit('CHANGE_PROBLEM', {
            problem,
        });
        setTimeout(() => {
            this.setLeaderboard();
        }, PROBLEM_TIME_SEC * 1000);
    }

    private setLeaderboard() {
        const leaderboard = this.getLeaderboard();
        IoManager.getIo().to(this.roomId).emit('leaderboard', {
            leaderboard,
        });
    }

    next() {
        this.activeProblem++;
        const problem = this.problems[this.activeProblem];
        if (problem) {
            this.setActiveProblem(problem);
        } else {
            // send final results here
            // io.emit("QUIZ_END", {
            //     problem,
            // });
        }
    }

    createRandomString(length: number) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    addUser(name: string) {
        const id = this.createRandomString(7);
        this.users.push({
            id,
            name,
            points: 0,
        });
        return id;
    }

    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmissions) {
        const problem = this.problems.find((x) => x.id === problemId);
        const user = this.users.find((x) => x.id === userId);
        if (!problem || !user) {
            console.log('problem/user not found');
            return;
        }
        const existingSubmission = problem.submissions.find((x) => x.userId === userId);
        if (existingSubmission) {
            console.log('existing submission');
            return;
        }
        problem.submissions.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected: submission,
        });
        user.points += 1000 - (500 * (new Date().getTime() - problem.startTime)) / PROBLEM_TIME_SEC;
    }

    getLeaderboard() {
        return this.users.sort((a, b) => (a.points < b.points ? 1 : -1)).splice(0, 10); // first 10 students
    }

    getCurrentState() {
        if (this.currentState === 'not_started') {
            return {
                type: 'not_started',
            };
        }
        if (this.currentState === 'ended') {
            return {
                type: 'ended',
                leaderboard: this.getLeaderboard(),
            };
        }
        if (this.currentState === 'leaderboard') {
            return {
                type: 'leaderboard',
                leaderboard: this.getLeaderboard(),
            };
        }
        if (this.currentState === 'question') {
            const problem = this.problems[this.activeProblem];
            return {
                type: 'question',
                problem,
            };
        }
    }
}
