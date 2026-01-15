import { BaseError } from './base.error'

export class ApiError extends BaseError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode)
  }
}
