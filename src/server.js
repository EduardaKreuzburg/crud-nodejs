const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use('/images', express.static("public/assets/images"));
app.use('/css', express.static("public/assets/css"));

app.get('/login', function(req, res) {
    res.render("../src/views/login");
})

app.get('/registrar', function(req, res) {
    res.render("../src/views/register");
})

app.get('/dashboard', function(req, res) {
    res.render("../src/views/dashboard");
})

app.get('/produtos', function(req, res) {
    res.render("../src/views/products");
})

app.get('/planos', function(req, res) {
    res.render("../src/views/plans");
})



app.listen(3000, () => {console.log("rodando")})