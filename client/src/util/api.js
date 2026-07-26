const API_IP = 'http://localhost';
const API_PORT = 9000;

const headers = {
    // https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept
    'Accept': '*/*',
    // https://www.rfc-editor.org/rfc/rfc7231#section-3.1.1.5
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
    'Content-Type': 'application/json'
}

const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;

const alerts = {
    getSearchData: async () => {
        let response = await fetch(serverRoute("alerts"), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    },

    //full details for one country
    getByCode: async (code) => {
        let response = await fetch(serverRoute(`alerts/${code}`), {
            headers,
            method: 'GET'
        });
        let data = await response.json();
        return data;
    }
};

//Bookmarks API
const bookmarks = {
  getAll: async () => {
    let response = await fetch(serverRoute("bookmarks"), {
      headers,
      method: "GET",
    });
    return await response.json();
  },

  setStatus: async (code, bookmarked) => {
    let response = await fetch(serverRoute(`bookmarks/${code}`), {
      headers,
      method: "POST",
      body: JSON.stringify({ bookmarked }),
    });
    return response;
  },
};

const util = {
    refreshDatabase: async () => {
        let response = await fetch(serverRoute("db/refresh"), {
            headers,
            method: 'POST'
        });
        return response;
    }
}

export {
    util,
    alerts,
    bookmarks
}
