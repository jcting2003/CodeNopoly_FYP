const mysql = require('mysql2/promise')
const QRCode = require('qrcode')
const fs = require('fs')
const path = require('path')

const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: 'codenopoly_user',
  password: 'secret',
  database: 'codenopoly',
}

const outputDir = path.join(__dirname, 'qr-codes')
const tileDir = path.join(outputDir, 'tiles')
const cardDir = path.join(outputDir, 'cards')

const safeFileName = (value) => {
  return String(value)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toUpperCase()
}

const ensureFolders = () => {
  fs.mkdirSync(outputDir, { recursive: true })
  fs.mkdirSync(tileDir, { recursive: true })
  fs.mkdirSync(cardDir, { recursive: true })
}

const generateQr = async ({ value, label, type }) => {
  const folder = type === 'card' ? cardDir : tileDir
  const fileName = `${safeFileName(value)}.png`
  const filePath = path.join(folder, fileName)

  await QRCode.toFile(filePath, value, {
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 600,
  })

  return {
    value,
    label,
    type,
    fileName,
    relativePath: `${type === 'card' ? 'cards' : 'tiles'}/${fileName}`,
  }
}

const generatePrintHtml = (items) => {
  const cardsHtml = items
    .map((item) => {
      return `
        <div class="qr-card">
          <img src="${item.relativePath}" alt="${item.value}" />
          <h3>${item.label}</h3>
          <p>${item.value}</p>
          <span>${item.type.toUpperCase()}</span>
        </div>
      `
    })
    .join('\n')

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Codenopoly QR Codes</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 24px;
      background: #f8fafc;
    }

    h1 {
      margin-bottom: 24px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }

    .qr-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 14px;
      text-align: center;
      page-break-inside: avoid;
    }

    .qr-card img {
      width: 150px;
      height: 150px;
      object-fit: contain;
    }

    .qr-card h3 {
      font-size: 14px;
      margin: 10px 0 4px;
    }

    .qr-card p {
      font-size: 12px;
      font-weight: bold;
      color: #4f46e5;
      margin: 0;
    }

    .qr-card span {
      display: inline-block;
      margin-top: 8px;
      font-size: 10px;
      font-weight: bold;
      color: #64748b;
    }

    @media print {
      body {
        background: white;
      }

      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  </style>
</head>
<body>
  <h1>Codenopoly QR Codes</h1>
  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>
`

  fs.writeFileSync(path.join(outputDir, 'print-sheet.html'), html)
}

const main = async () => {
  ensureFolders()

  const connection = await mysql.createConnection(dbConfig)

  console.log('Connected to database.')

  const [tiles] = await connection.execute(`
    SELECT 
      id,
      tile_number,
      tile_name,
      nfc_value,
      tile_type
    FROM tiles
    WHERE nfc_value IS NOT NULL
      AND nfc_value <> ''
    ORDER BY tile_number ASC
  `)

  const [cards] = await connection.execute(`
    SELECT
      id,
      card_code,
      card_type,
      title
    FROM cards
    WHERE card_code IS NOT NULL
      AND card_code <> ''
    ORDER BY card_type ASC, card_code ASC
  `)

  const generatedItems = []

  for (const tile of tiles) {
    const item = await generateQr({
      value: tile.nfc_value,
      label: `${tile.tile_number} - ${tile.tile_name}`,
      type: 'tile',
    })

    generatedItems.push(item)
    console.log(`Generated tile QR: ${tile.nfc_value}`)
  }

  for (const card of cards) {
    const item = await generateQr({
      value: card.card_code,
      label: `${card.card_type} - ${card.title}`,
      type: 'card',
    })

    generatedItems.push(item)
    console.log(`Generated card QR: ${card.card_code}`)
  }

  generatePrintHtml(generatedItems)

  await connection.end()

  console.log('')
  console.log('Done!')
  console.log(`QR codes saved in: ${outputDir}`)
  console.log(`Open this file to print: ${path.join(outputDir, 'print-sheet.html')}`)
}

main().catch((error) => {
  console.error('Failed to generate QR codes:')
  console.error(error)
  process.exit(1)
})