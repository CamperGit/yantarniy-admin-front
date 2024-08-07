import {api} from "boot/axios";
import { authHeader } from "src/services/auth/authUtils";

const API_URL = '/v1/employees';

class EmployeeService {
  async getPage({typeId, locationId, descriptionLike, pageNumber, pageSize, sortDirection, sortProperty}) {
    try {
      const authorizationHeader = await authHeader();
      const {data} = await api.get(`${API_URL}/page`, {
        params: {
          typeId,
          locationId,
          descriptionLike,
          pageNumber,
          pageSize,
          sortDirection,
          sortProperty
        },
        headers: authorizationHeader
      })
      return data
    } catch (e) {
      console.log(e)
      return [];
    }
  }

  async getItemById(id) {
    try {
      const authorizationHeader = await authHeader();
      const {data} = await api.get(`${API_URL}/${id}`, {headers: authorizationHeader})
      return data;
    } catch (e) {
      throw e;
    }
  }

  async getAll() {
    try {
      const authorizationHeader = await authHeader();
      const {data} = await api.get(API_URL,{headers: authorizationHeader})
      return data;
    } catch (e) {
      throw e;
    }
  }

  async create(item) {
    try {
      const authorizationHeader = await authHeader();
      return await api.post(`${API_URL}`, item, {headers: authorizationHeader})
    } catch (e) {
      throw e
    }
  }

  async update(item) {
    try {
      const authorizationHeader = await authHeader();
      return await api.put(`${API_URL}/${item.id}`, item, {headers: authorizationHeader})
    } catch (e) {
      throw e
    }
  }

  async deleteById(id) {
    try {
      const authorizationHeader = await authHeader();
      return await api.delete(`${API_URL}/${id}`, {headers: authorizationHeader})
    } catch (e) {
      throw e
    }
  }
}

export default new EmployeeService();
