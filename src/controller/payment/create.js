const cashschema = require('../../module/cash.schema')
const userSchema = require('../../module/user.schema')
const bookSchema = require('../../module/book.schema')
const success = (res, status, msg) => {
    return res.status(status).send({ status: true, data: msg })
}
const unsuccess = (res, status, msg) => {
    return res.status(status).send({ status: false, message: msg })
}
const dbcheck = async (schema, query) => {
    try {
        return await schema.findOne(query)
    }
    catch (err) {
        return null
    }
}
const createpayment = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length == 0) return unsuccess(res, 400, "Post is required")
        data.userId = req.decodeToken.user //default userid from token
        data.type = data.type.toUpperCase()
        let { amount, category, date, title, userId, bookId, type } = data
        if (!amount) return unsuccess(res, 400, "Amount is required")
        if (!category) return unsuccess(res, 400, "Category is required")
        if (!Array.isArray(category)) return unsuccess(res, 400, "Category required in array")
        if (!title || !title.trim()) return unsuccess(res, 400, "Title is required")
        if (!bookId || !bookId.trim()) return unsuccess(res, 400, "BookId is required")
        if (!date || !date.trim()) return unsuccess(res, 400, "Date is required")
        if (!type || !type.trim()) return unsuccess(res, 400, "type is required")
        if (["IN", "OUT"].indexOf(type) === -1) return unsuccess(res, 400, "type has only IN and OUT value")
        if (!await dbcheck(bookSchema, { _id: bookId, isDeleted: false, userId: userId })) return unsuccess(res, 404, "BookId is invalid")
        data.date = new Date(date).getTime()
        let cash = await cashschema.create(data)
        return success(res, 201, cash)
    }
    catch (e) {
        return unsuccess(res, 500, e.message)
    }
}
module.exports = { createpayment }