import {api} from "boot/axios";
import { authHeader } from "src/service/auth/authUtils";

const BASE_URL = '/api/v1/users';
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

  async create(user) {
    try {
      const {data} = await api.post(BASE_URL, user,{
        headers : await authHeader()
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async update(user) {
    try {
      const {data} = await api.put(`${BASE_URL}/${user.id}`, user, {
        headers : await authHeader()
      })
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new UserService();
