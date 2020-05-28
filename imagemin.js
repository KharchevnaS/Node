// express = require('express');
// const multer = require('multer');
// require('dotenv').config();
// const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminPngquant = require('imagemin-pngquant');
// const PORT = process.env.PORT;
// const app = express();
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: 'draftImages',
//     filename: function (req, file, cb) {
//         const ext = path.parse(file.originalname).ext;
//       cb(null, Date.now() + ext);
//     }
//   });

// const upload = multer({ storage });
// app.use(express.static('public/images'));

// app.post('/images', upload.single('avatar'), minifyImage, (req, res, next)=>{
//   console.log('req.file', req.file);
//     console.log(req.body);  
//     res.status(200).send();
// })
// app.listen(PORT, ()=>{
//     console.log('server is working on PORT', PORT)
// })

// async function minifyImage(req, res, next) {
// try {
//    const MINIFIED_DIR = 'public/images'
//    await imagemin([req.file.path], {
//         destination: MINIFIED_DIR,
//         plugins: [
//             imageminJpegtran(),
//             imageminPngquant({
//                 quality: [0.6, 0.8]
//             })
//         ]
//     });
//     const { filename } = req.file

// req.file = {
//     ...req.file,
//     path: path.join(MINIFIED_DIR, filename),
//     destination: MINIFIED_DIR
// }
// next();
//     }
//     catch(err) {
//         next(err)
//     }
// }