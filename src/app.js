const { readFileSync } = require('fs')
const { join } = require('path')
const express = require('express')
const { format } = require('date-fns')
const { insertDocument, findDocuments, truncateDocuments, close } = require('./db')

const { PORT } = process.env
const app = express()
const serverInfo = readFileSync(join(__dirname, 'server_info'), 'utf-8')
const VERSION = readFileSync(join(__dirname, '..', 'version'), 'utf-8').replace('\n', '')

app.get('/', async function (req, res) {
  try {
    await insertDocument({
      path: '/',
      date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      serverInfo
    });

    const documents = await findDocuments();
    const html = documentsToHtml(documents);

    res.set({
      'appVersion': VERSION
    });
    res.status(200).send(html);
  } catch (error) {
    res.status(500).send('Error ' + error);
  }
})

app.get('/clean', async function (req, res) {
  try {
    await truncateDocuments();

    res.status(200).send('Cleaned :)');
  } catch (error) {
    res.status(500).send('Error ' + error);
  }
})

function documentsToHtml(documents) {
  html = `
    <h1>Documents list (${documents.length})</h1>
    <table cellpadding=10>
      <tr>
        <th>Date</th>
        <th>Path</th>
        <th>Server info</th>
      </tr>
      ${getDocTr(documents[0])}
      ${getDocTr(documents[documents.length-1])}
    </table>

    <a href="/clean">clean</a>
  `;

  return html
}

function getDocTr(doc) {
  return `
    <tr>
      <td>${doc.date}</td>
      <td>${doc.path}</td>
      <td>${doc.serverInfo}</td>
    </tr>
  `
}


console.log(`app listening on port ${PORT}`);
const server = app.listen(PORT)

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('app terminated')
  })
})
