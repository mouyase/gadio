const request = require('request')
const fs = require('fs')

try {
    fs.mkdirSync('dist')
} catch (e) {

}

const CATEGORY_AD = '62'
const CATEGORY_BOOK = '64'

let gadioLibrary = []

const getGadioData = (page = 0) => {
    const url = `https://www.gcores.com/gapi/v1/radios?page[limit]=100&page[offset]=${page * 100}&sort=-published-at&include=category,media&fields[radios]=title,published-at,duration,category`
    request({url: url,}, (error, response, body) => {
        if (!error && body) {
            const data = JSON.parse(body)?.data
            const included = JSON.parse(body)?.included
            if (data && included) {
                if (data.length > 0) {
                    const medias = included.filter(item => item.type === 'medias')
                    const radios = data.filter(item => item.type === 'radios')
                    const categories = included.filter(item => item.type === 'categories' && item.id !== CATEGORY_AD && item.id !== CATEGORY_BOOK)
                    const gadios = radios.map(radio => {
                        const mediaItem = medias.find(media => radio.attributes?.duration === media.attributes?.duration)
                        const media = mediaItem?.attributes?.audio
                        const categoryItem = categories.find(category => radio.relationships?.category?.data?.id === category?.id)
                        const category = categoryItem?.attributes?.name
                        if (media && category) {
                            return {
                                id: radio.id,
                                title: radio.attributes.title,
                                data: radio.attributes['published-at'].slice(0, 10),
                                media: media.indexOf('https://') !== -1 ? media : `https://alioss.gcores.com/uploads/audio/${media}`,
                                category: category
                            }
                        }
                    }).filter(radio => radio)
                    gadioLibrary = gadioLibrary.concat(gadios)
                    gadioLibrary = gadioLibrary.sort((a, b) => {
                        if (a.data === b.data) {
                            return b.id - a.id
                        } else {
                            return b.data - a.data
                        }
                    })
                    const json = JSON.stringify(gadioLibrary)
                    if (json) {
                        try {
                            fs.writeFileSync('dist/gadio.json', json)
                            fs.writeFileSync('dist/index.html', json)
                        } catch (e) {
                        }
                    }
                    getGadioData(page + 1)
                }
            }
        }
    })
}

getGadioData()
