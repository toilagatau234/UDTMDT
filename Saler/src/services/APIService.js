// Saler/src/services/APIServices.js
app.service("APIService", function ($http) {
  const BASE = "http://127.0.0.1:8080/api/"; 

  let token = localStorage.getItem("token") || "";
  this.setToken = function (t) {
    token = t || "";
    if (t) localStorage.setItem("token", t); else localStorage.removeItem("token");
  };

  this.callAPI = function (endpoint, method, data, headers) {
    if (!endpoint || typeof endpoint !== "string") {
      throw new Error("Invalid endpoint for APIService.callAPI");
    }
    const h = Object.assign({}, headers || {});
    if (token && !h.Authorization) h.Authorization = "Bearer " + token;

    return $http({
      method: method,
      url: BASE + endpoint,   
      data: data,
      headers: h
    });
  };
});

