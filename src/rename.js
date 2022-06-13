const fs = require('fs')

const json = JSON.parse(fs.readFileSync('dist/gadio.json', 'utf-8'))

json.map(item => {
    const name = item.title.replace('/', '')
    const oldPath = `gadio/${item.file}`
    const newPath = `gadio/[${item.date}]${name}[${item.category}].mp3`
    fs.rename(oldPath, newPath, function (err) {
        if (!err) {
            console.log(newPath + ' - 成功')
        }
    })
})
