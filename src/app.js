import express from 'express';

const app = express();
const server = app.listen(8080, ()=> console.log("Listening on PORT 8080"));

app.use(express.json()) //Como indica el método, ahora el servidor podrá recibir jsons al momento de la petición
app.use(express.urlencoded({extended:true})) //Permite que se pueda enviar información también desde la URL

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
