// include module express//
const express = require("express");
const cors = require("cors"); // ajouter pour le frontend
const { success, error } = require("consola");
const morgan = require('morgan')


require ('dotenv').config(); //fichier secret
const db = require("./Config/db"); //data base

const PORT = process.env.APP_PORT || 3000; // port, acceder au .env si non utiliser le port 3000
const DOMAIN = process.env.APP_DOMAIN ;

const categoryRouter = require("./Routes/categoryRouter"); //  dec chemin category 
const subcategoryRouter = require("./Routes/subCategoryRouter"); // dec chemin subCategory 
const productRouter = require("./Routes/productRouter");   // dec chemin product
const authRouter = require("./Routes/authRouter");
const orderRouter = require("./Routes/orderRouter");




// create an application
const app = express();

// Middlewares 
app.use(cors()); //proteger et transformer entre les deux services back et front en securité
app.use(express.json()); // nouveau methode middlware ; parse application/json
app.use(morgan('tiny'))

//  pour faire afficher image sur postman
app.get('/getfile/:image', (req, res) => {
  res.sendFile(__dirname + '/storages/' + req.params.image);
});

app.use("/cat", categoryRouter); // route for category
app.use("/subcat", subcategoryRouter); // route for subCategory
app.use("/product", productRouter); // route for product
app.use("/", authRouter);
app.use("/order", orderRouter);
// Start listenting for the server on PORT
app.listen(PORT, async () => {
  try {
    success({
      message: `Server started on PORT ${PORT}` + `URL : ${DOMAIN}`,
      badge: true,
    });
  } catch (err) {
    error({ message: `error with server`, badge: true });
  }
});
