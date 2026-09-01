const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = '';
const CUSTOM_OBJECT_TYPE = '2-267694865';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
// ROUTE 1 - Fetch custom object data and pass it to the homepage template
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=characterid,name,alignment,lightsabercolor`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    const params = {
        properties: ['characterid', 'name', 'alignment', 'lightsabercolor']
    }

    try {
        const resp = await axios.get(url, { headers, params });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Objects | HubSpot APIs', data });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error fetching force user data.');
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// * Code for Route 2 goes here

app.get('/update-cobj', (req, res) => {
    try {
        res.render('updates', { pageTitle: 'Update ForceUser Form'});
    } catch (error) {
        res.status(500).send("Error fetching Update ForceUser Form")
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
// * Code for Route 3 goes here

app.post('/update-cobj', async (req, res) => {
    const {
        recordId,
        characterid,
        name,
        alignment,
        lightsabercolor
    } = req.body;

    const record = {
        properties: {
            characterid,
            name,
            alignment,
            lightsabercolor
        }
    };

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }

    try {
        if (recordId) {
            // Update an existing record
            const updateUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}/${recordId}`;
            await axios.patch(updateUrl, record, { headers });
        } else {
            // Create a new record
            const createUrl = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
            await axios.post(createUrl, record, { headers });
        }
        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Error saving ForceUser record.');
    }
});

// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));