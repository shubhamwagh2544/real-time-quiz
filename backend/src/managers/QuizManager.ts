import { Quiz } from "../Quiz";
import { IoManager } from "./IoManager";

export class QuizManager {
  private quizzes: Quiz[];

  constructor() {
    this.quizzes = [];
  }

  public start(roomId: string) {
    const io = IoManager.getIo();
    const quiz = this.quizzes.find((quiz) => quiz.roomId === roomId);
    if (!quiz) return;
    quiz.start();
  }

  public next(roomId: string) {
    const io = IoManager.getIo();
    io.to(roomId).emit("START_ROOM");
  }

  public addUser(roomId: string, name: string) {
    return this.getQuiz(roomId)?.addUser(name);
  }

  public submit(roomId: string, submission: 0 | 1 | 2 | 3) {

  }

  public getQuiz(roomId: string) {
    return this.quizzes.find((quiz) => quiz.roomId === roomId) ?? null;
  }
}
