import multer from "multer"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let fileTypeName = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        if (file.mimetype !== fileTypeName) {
            return cb("Please Check File Type")
        }
        return cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}${file.originalname}`
        return cb(null, fileName)
    }
})

export const upload = multer({ storage: storage })