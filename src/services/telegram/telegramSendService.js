import {api} from "boot/axios";
import { authHeader } from "src/services/auth/authUtils";

const API_URL = '/v1/telegram-sends';

class TelegramSendService {
  async sendMessage(file, description, fileModel, onlyAdmins) {
    try {
      const authorizationHeader = await authHeader();
      let formData = new FormData();
      let fileId = null;
      if (fileModel) {
        fileId = fileModel.id;
      }
      const blob = new Blob([JSON.stringify({ description, onlyAdmins, fileId })], {
        type: "application/json"
      });
      formData.append("request", blob);
      formData.append("image", file);
      const { data } = await api.post(`${API_URL}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...authorizationHeader
        }
      });
      return data;
    } catch (e) {
      throw e;
    }
  }
}

export default new TelegramSendService();
