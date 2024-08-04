import { IoManager } from './managers/IoManager';

interface User {
  id: string;
  name: string;
}

interface Problem {
  title: string;
  description: string;
  image: string;
  answer: string;
  option: {
    id: number;
    title: string;
  };
}

export class Quiz {
  public roomId: string;
  private hasStarted: boolean;
  private problems: Problem[];
  private activeProblems: number;
  private users: User[];

  constructor(roomId: string) {
    this.roomId = roomId;
    this.hasStarted = false;
    this.problems = [];
    this.activeProblems = 0;
    this.users = [];
  }

  addProblem(problem: Problem) {
    this.problems.push(problem);
  }

  start() {
    this.hasStarted = true;
    const io = IoManager.getIo();
    io.emit('CHANGE_PROBLEM', {
      problem: this.problems[0],
    });
  }

  next() {
    this.activeProblems++;
    const problem = this.problems[this.activeProblems];
    const io = IoManager.getIo();
    if (problem) {
      io.emit('CHANGE_PROBLEM', {
        problem,
      });
    } else {
      io.emit('QUIZ_END', {
        problem,
      });
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
    });
    return id;
  }
}
