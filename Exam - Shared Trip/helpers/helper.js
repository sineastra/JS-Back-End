module.exports = {
    createErrorMsg: errors =>
        errors
            .array()
            .map(x => x.msg)
            .join("<br />"),
}
