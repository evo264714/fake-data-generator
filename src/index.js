
const express = require('express');
const path = require('path');
const dataGenerator = require('./dataGenerator');
const { Parser } = require('json2csv');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/generate', (req, res) => {
    try {
        const { seed, region, errors, page } = req.query;
        const data = dataGenerator.generateData(seed, region, errors, page);
        res.json(data);
    } catch (error) {
        console.error('Error in /generate route:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/export', (req, res) => {
    try {
        const { seed, region, errors, pages } = req.query;
        let allData = [];
        for (let page = 1; page <= pages; page++) {
            const data = dataGenerator.generateData(seed, region, errors, page);
            allData = allData.concat(data);
        }

        const fields = ['index', 'id', 'name', 'address', 'phone'];
        const parser = new Parser({ fields });
        const csv = parser.parse(allData);

        res.header('Content-Type', 'text/csv');
        res.attachment('data.csv');
        res.send(csv);
    } catch (error) {
        console.error('Error in /export route:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
