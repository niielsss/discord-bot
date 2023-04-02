const http = require('./http-common.js');

const getPlayer = async (username) => {
    return http.get(`https://api.potterworldmc.com/player/${username}`)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.log(error);
        });
};

module.exports = { getPlayer };