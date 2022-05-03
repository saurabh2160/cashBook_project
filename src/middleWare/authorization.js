const bookModule = require('../module/book.schema')


const authZ_forBook = async (req, res, next) => {
    try {
        // get params Data
        let bookId = req.params.bookId;
        let userID = req.decodeToken.user;
        if (!bookId) return res.status(400).send({
            status: !true,
            message: "book id Must be required"
        })

        // validate books userId with tokens UserId
        const validate = await bookModule.findOne({
            userId: userID,
            _id: bookId
        })
        if (!validate) return res.status(403).send({
            status: !true,
            message: "Unauthorized access, Please try with a valid book ID"
        })
        next();
    } catch (err) {
        res.status(500).send({
            status: !true,
            message: err.message
        })
    }
}

module.exports.byBook = authZ_forBook