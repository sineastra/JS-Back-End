const getCubesByQuery = (params, data, queryObj) => {
    let items = []

    params.forEach(x => {
        if (queryObj[x] !== "" && queryObj[x] !== undefined) {
            const filteredItems = Object.values(data).filter(cube =>
                x !== "difficultyLevel"
                    ? cube[x].toLowerCase().includes(queryObj[x].toLowerCase())
                    : queryObj[x].includes(Number(cube["difficultyLevel"]))
            )

            if (filteredItems.length > 0) items = items.concat(filteredItems)
        }
    })

    return items
}

const addDifficultyParam = (getMinMax, queryObj) => {
    const dataCopy = Object.assign({}, queryObj)
    const range = []
    const [minDifficulty, maxDifficulty] = getMinMax()
    const minRange = Number(dataCopy.from) || minDifficulty
    const maxRange = Number(dataCopy.to) !== 0 ? Number(dataCopy.to) : -1 || maxDifficulty

    for (let i = minRange; i < maxRange + 1; i += 1) {
        range.push(i)
    }

    return { ...dataCopy, difficultyLevel: range }
}

module.exports = async (req, res) => {
    const allCubes = await req.dbController.getAllEntries()
    const filterParams = ["name", "difficultyLevel"]

    const cubes =
        Object.keys(req.query).length === 0
            ? allCubes
            : getCubesByQuery(
                  filterParams,
                  allCubes,
                  addDifficultyParam(req.dbController.getMinMaxDifficulty, req.query)
              )

    res.render("index", {
        title: "Home page",
        cubes,
    })
}
