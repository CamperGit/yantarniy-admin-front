import {api} from "boot/axios";
import { authHeader } from "src/services/auth/authUtils";

const BASE_URL = '/v1/users';
class UserService {
  async getUserInfo() {
    try {
      const {data} = await api.get(`${BASE_URL}/info`, {
        headers : await authHeader()
      });
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new UserService();
