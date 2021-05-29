const fs = require("fs/promises")
const idFactory = require("uniqid")

let data = {}

const dbInit = async () => {
    try {
        data = JSON.parse(await fs.readFile("./back-end/database.json"))
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
    data[id] = entry

    try {
        await fs.writeFile("./back-end/database.json", JSON.stringify(data, null, 4))
    } catch (e) {
        console.log(`Error - ${e} while trying to write to the Database`)
    }
}

const getAllEntries = async () =>
    Object.entries(data).map(x => ({
        ...{ id: x[0] },
        ...x[1],
    }))

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
