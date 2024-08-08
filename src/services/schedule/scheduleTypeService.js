import {api} from "boot/axios";
import { authHeader } from "src/services/auth/authUtils";

const API_URL = '/v1/schedule-types';

class ScheduleTypeService {

  async getAll() {
    try {
      const authorizationHeader = await authHeader();
      const {data} = await api.get(API_URL,{headers: authorizationHeader})
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new ScheduleTypeService();