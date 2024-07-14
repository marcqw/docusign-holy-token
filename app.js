import readline from 'readline';
import axios from 'axios';
import btoa from 'btoa';
import open from 'open';

// Fonction pour lire l'entrée utilisateur
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
        await open(authUrl);

        const accessCode = await question('Enter the access code from the browser: ');

        const encodedKey = btoa(`${integrationKey}:${secretKey}`);
        const response = await axios.post('https://account-d.docusign.com/oauth/token', new URLSearchParams({
            code: accessCode,
            grant_type: 'authorization_code'
        }).toString(), {
            headers: {
                'Authorization': `Basic ${encodedKey}`,
                'Content-Type': 'application/x-www-form-urlencoded'
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