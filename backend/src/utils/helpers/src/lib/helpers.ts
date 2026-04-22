import * as bcrypt from 'bcryptjs';
import { errorMessages } from './errors/errors';

export function hashPassword(password: string) {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  } catch (_err) {
    throw new Error(getResponseMessage(101));
  }
}

export function comparePassword(password: string, userPassword: string) {
  try {
    return bcrypt.compareSync(password, userPassword);
  } catch (_err) {
    throw new Error(getResponseMessage(101));
  }
}

export function getResponseMessage(errorCode: number) {
  const errorObject = errorMessages.find(
    (error: any) => error.code === errorCode,
  );
  return errorObject ? errorObject.message : 'unknown error';
}
