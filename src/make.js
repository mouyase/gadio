const fs = require('fs')

try {
    fs.mkdirSync('download')
} catch (e) {
}

const json = JSON.parse(fs.readFileSync('dist/gadio.json', 'utf-8'))

let downloadListString = ''

json.map(item => {
    downloadListString = downloadListString + item.media + '\n'
})

fs.writeFileSync('download/list.txt', downloadListString)
