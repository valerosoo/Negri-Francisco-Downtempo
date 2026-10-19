import { request } from "./api.js";

const RESOURCE = "/djs";

export function getDJs() {
  return request(RESOURCE);
}

export function getDJ(id) {
  return request(`${RESOURCE}/${id}`);
}

export function createDJ(data) {
  return request(RESOURCE, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateDJ(id, data) {
  return request(`${RESOURCE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteDJ(id) {
  return request(`${RESOURCE}/${id}`, {
    method: "DELETE",
  });
}
