import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {

        cb(null, 'uploads/');
    },
    filename(req, file, cb) {

        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});


function checkFileType(file, cb) {
    // Adicione webp aqui
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        // Se cair aqui, o multer lança um erro que pode virar 500 se não tratado
        cb(new Error('Apenas imagens (jpg, jpeg, png, webp)!'));
    }
}


const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});


router.post('/', (req, res) => {
    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Erro do próprio Multer
            return res.status(400).send({ message: `Erro no Multer: ${err.message}` });
        } else if (err) {
            // Erro da nossa função checkFileType
            return res.status(400).send({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).send({ message: 'Nenhum arquivo enviado!' });
        }

        res.send(`/${req.file.path.replace(/\\/g, '/')}`);
    });
});

export default router;