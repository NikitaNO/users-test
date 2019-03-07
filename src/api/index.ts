const usersMock = require('./usersMock');

export interface ITask {
  id: number;
  userId: number;
  title: string;
  description: string;
  score: number;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  tasks: ITask[];
}

export const getUsers =
  (): Promise<IUser[]> =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(usersMock);
      }, 900);
    });
