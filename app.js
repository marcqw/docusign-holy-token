const readline = require('readline');
const axios = require('axios');
const open = require('open');
const btoa = require('btoa');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

async function main() {
    try {
        const integrationKey = await question('Enter Integration Key: ');
        const secretKey = await question('Enter Secret Key: ');

        const authUrl = `https://account-d.docusign.com/oauth/auth?response_type=code&scope=impersonation signature&client_id=${integrationKey}&redirect_uri=https://developers.docusign.com/platform/auth/consent`;
        console.log(`Opening browser to: ${authUrl}`);
        open(authUrl);

        const accessCode = await question('Enter the access code from the browser: ');

        const encodedKey = btoa(`${integrationKey}:${secretKey}`);
        const response = await axios.post('https://account-d.docusign.com/oauth/token', null, {
            headers: {
                'Authorization': `Basic ${encodedKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            params: {
                code: accessCode,
                grant_type: 'authorization_code'
            }
        });

        console.log('Token response:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    } finally {
        rl.close();
    }
}

main();