// imports
const path = require('path');
const axios = require('axios');

// dotenv
require('dotenv').config({ path: path.join(__dirname, '../authentication', '.env') });
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, PORT } = process.env

async function getUser(CODE){
    try {
        const code = CODE.toString();
        
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
            scope: 'identify',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const accessToken = tokenResponse.data.access_token;
        
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const tokenRefresh = tokenResponse.data.refresh_token;
        const user = userResponse.data;

        return { user, token: tokenRefresh };
    } catch (error) {
        return false
    }
}

async function tokenRefresh(CODE){
    try {
        const refreshToken = CODE.toString();
        
        const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            scope: 'identify',
          }), {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          });

        const accessToken = tokenResponse.data.access_token;
        
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const tokenRefresh = tokenResponse.data.refresh_token;
        const user = userResponse.data;

        return { user, token: tokenRefresh };
    } catch (error) {
        return false
    }
} 
module.exports = {
    getUser,
    tokenRefresh
};