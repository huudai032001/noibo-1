import ApiService from '@/services/api-service'
import type {
  ConfirmTestInputPayload,
  ConfirmTestInputResponse,
  ShowConfirmTestInputResponse,
} from '../models/confirm-sms-test-input.model'
import { CONFIRM_SMS_API } from '../constants'

export async function fetchConfirmSmsTestInput(
  uuid: string,
): Promise<ShowConfirmTestInputResponse> {
  return ApiService.get<{ uuid: string }, ShowConfirmTestInputResponse>(CONFIRM_SMS_API.show, {
    uuid,
  })
}

export async function confirmSmsTestInput(
  payload: ConfirmTestInputPayload,
): Promise<ConfirmTestInputResponse> {
  return ApiService.post<ConfirmTestInputPayload, ConfirmTestInputResponse>(
    CONFIRM_SMS_API.confirm,
    payload,
  )
}
