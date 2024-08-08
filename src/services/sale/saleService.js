import { api } from "boot/axios";
import { authHeader } from "src/services/auth/authUtils";

const API_URL = "/v1/sales";

class SaleService {
  async getPage({ locationId, descriptionLike, pageNumber, pageSize, sortDirection, sortProperty }) {
    try {
      const authorizationHeader = await authHeader();
      const { data } = await api.get(`${API_URL}/page`, {
        params: {
          locationId,
          descriptionLike,
          pageNumber,
          pageSize,
          sortDirection,
          sortProperty
        },
        headers: authorizationHeader
      });
      return data;
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getItemById(id) {
    try {
      const authorizationHeader = await authHeader();
      const { data } = await api.get(`${API_URL}/${id}`, { headers: authorizationHeader });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getAll() {
    try {
      const authorizationHeader = await authHeader();
      const { data } = await api.get(API_URL, { headers: authorizationHeader });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async create(item, file) {
    try {
      const authorizationHeader = await authHeader();
      let formData = new FormData();
      const blob = new Blob([JSON.stringify(item)], {
        type: "application/json"
      });
      formData.append("sale", blob);
      formData.append("image", file);
      const { data } = await api.post(`${API_URL}/creating`, formData, {
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

  async update(item, file) {
    try {
      const authorizationHeader = await authHeader();
      let formData = new FormData();
      const blob = new Blob([JSON.stringify(item)], {
        type: "application/json"
      });
      formData.append("sale", blob);
      formData.append("image", file);
      const { data } = await api.post(`${API_URL}/updating`, formData, {
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

  async deleteById(id) {
    try {
      const authorizationHeader = await authHeader();
      return await api.delete(`${API_URL}/${id}`, { headers: authorizationHeader });
    } catch (e) {
      throw e;
    }
  }
}

export default new SaleService();
