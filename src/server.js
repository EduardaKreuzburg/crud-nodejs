const express = require('express');
const formidable = require('formidable');
const session = require('express-session');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const app = express();

const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductController');

const PORT = 3000;

app.set('view engine', 'ejs');

app.use(express.json());

app.use('/images', express.static("public/assets/images"));
app.use('/css', express.static("public/assets/css"));

app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: false,
    saveUninitialized: true
}));

// TODO: erro genérico
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', function (req, res) {
    res.redirect('/dashboard');
})

app.get('/login', function (req, res) {
    if (req.session.logged) {
        res.redirect('/dashboard');
    } else {
        res.render("../src/views/login");
    }
})

app.post('/login', function (req, res) {
    if (req.session.logged) {
        res.redirect('/dashboard');
    } else {
        try {
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                const { email, password } = fields;
                try {
                    const authenticated = await UserController.auth({ email, password });

                    if (authenticated) {
                        req.session.logged = true;
                        res.redirect('/dashboard');
                    } else {
                        res.redirect('/login');
                    }

                } catch (error) {
                    console.error(error);
                    res.redirect('/login');
                }
            });
        } catch (error) {
            console.error(error);
            res.redirect('/login');
        }
    }
})

app.get('/registrar', function (req, res) {
    if (req.session.logged) {
        res.redirect('/dashboard');
    } else {
        res.render("../src/views/register");
    }
})

app.post('/registrar', function (req, res) {
    try {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const { name, email, password } = fields;
            try {
                await UserController.register({ name, email, password });
                res.redirect('/login');
            } catch (error) {
                console.error(error);
                res.redirect('/registrar');
            }
        });
    } catch (error) {
        res.redirect('/registrar');
    }
})

app.get('/dashboard', function (req, res) {
    if (!req.session.logged) {
        res.redirect('/login');
    } else {
        res.render("../src/views/dashboard");
    }
})

app.get('/produtos', async function (req, res) {
    if (!req.session.logged) {
        res.redirect('/login');
    } else {
        const products = await ProductController.get();
        res.render("../src/views/products", { products });
    }
})

app.post('/produtos', async function (req, res) {
    if (!req.session.logged) {
        res.redirect('/login');
    } else {
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const { name, description, quantity, price } = fields;
            try {
                if (!files.image.originalFilename) {
                    //não foi enviado arquivo
                    await ProductController.register({ name, description, quantity, price });
                    res.redirect('/produtos');
                }
                else {
                    const oldPath = files.image.filepath;
                    const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex') + 'storedImage';
                    const filename = hash + '.' + files.image.mimetype.split('/')[1];

                    const newPath = path.join(__dirname, '../public/assets/images/', filename);
                    fs.rename(oldPath, newPath, function (err) {
                        if (err) throw err;
                    });

                    await ProductController.register({ name, description, quantity, price, filename });
                    res.redirect('/produtos');
                }
            } catch (error) {
                console.error(error);
                // TODO: tratar isso melhor...
                res.redirect('/produtos');
            }
        });
    }
})

app.get('/produtos/:id', async function (req, res) {
    if (!req.session.logged) {
        res.redirect('/login');
    } else {
        const { id } = req.params;
        const product = await ProductController.getById(id);
        res.send(product);
    }
})

app.post('/produtos/:id', async function (req, res) {
    if (!req.session.logged) {
        res.redirect('/login');
    } else {
        const { id } = req.params;
        const form = new formidable.IncomingForm();
        form.parse(req, async (err, fields, files) => {
            const { name, description, quantity, price } = fields;
            if (!files.image.originalFilename) {
                //não foi enviado arquivo
                const updated = await ProductController.edit(id, { name, description, quantity, price });
                res.redirect('/produtos');
            } else {
                const product = await ProductController.getById(id);
                if (product.filename) {
                    const pathToRemove = path.join(__dirname, '../public/assets/images/', product.filename);
                    fs.unlink(pathToRemove, (err) => {
                        if (err) throw err;
                        console.log('file was deleted');
                    })
                }

                const oldPath = files.image.filepath;
                const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex') + 'storedImage';
                const filename = hash + '.' + files.image.mimetype.split('/')[1];

                const newPath = path.join(__dirname, '../public/assets/images/', filename);
                fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err;
                });



                const updated = await ProductController.edit(id, { name, description, quantity, price, filename });
                res.redirect('/produtos');
            }
        })
    }
})

app.delete('/produtos/:id', async function (req, res) {
    if (!req.session.logged) {
        res.redirect('/login');
    } else {
        const { id } = req.params;
        const product = await ProductController.getById(id);
        if (product.filename) {
            const pathToRemove = path.join(__dirname, '../public/assets/images/', product.filename);
            fs.unlink(pathToRemove, (err) => {
                if (err) throw err;
                console.log('file was deleted');
            })
        }
        const deleted = await ProductController.delete(id);
        res.send(!!deleted);
    }
})

app.get('/planos', function (req, res) {
    if (!req.session.logged) {
        res.redirect('/login');
    } else {
        res.render("../src/views/plans");
    }
})

app.get('/logout', function (req, res) {
    req.session.logged = false;
    res.redirect('/login');
})

// TODO: 404
app.use(function (req, res, next) {
    res.status(404).send('Sorry cant find that!');
    // res.render("../src/views/plans");
});



app.listen(PORT, () => { console.log(`rodando na porta ${PORT}`) });