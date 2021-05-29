const fs = require("fs/promises")
const idFactory = require("uniqid")

let data = {}

const dbInit = async () => {
    try {
        data = await JSON.parse(fs.readFile("./back-end/database.json"))
    } catch (e) {
        console.log(`Problem with DB initialization. -> ${e}`)
    }

    return (req, res, next) => {
        req.dbController = {
            insertEntry,
            getAllEntries,
            getEntryById,
        }
        next()
    }
}

const insertEntry = async entry => {
    const id = idFactory()

    try {
        data = { ...data, ...{ id, entry } }
        await fs.writeFile(JSON.stringify(data))
    } catch (e) {
        console.log(`Error - ${e} while trying to write to the Database`)
    }
}

const getAllEntries = async () => {
    return Object.entries(data).map(x => ({
        ...{ id: x[1].id },
        ...x[1],
    }))
}

const getEntryById = async id => {
    try {
        return data[id]
    } catch (e) {
        console.log(`Error while trying to get item from Database -> ${e}`)
    }
}

module.exports = {
    dbInit,
    insertEntry,
    getAllEntries,
    getEntryById,
}
