import express from "express";
import db from "./util/database.js";
import User from "./models/users.model.js";
import 'dotenv/config'

User;

const POST = process.env.PORT ?? 8000;

db.authenticate()
  .then(() => {
    console.log("Conexion correcta");
  })
  .catch((err) => console.log(err));

db.sync()
  .then(() => console.log("base de datos sincronizada"))
  .catch((error) => console.log(error));

const app = express();

app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.send("OK");
});

//CREATE user

app.post("/users", async (req, res) => {
  try {
    const { body } = req;

    const user = await User.create(body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json(error)
  }
});

//READ users
app.get('/users', async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (error) {
        res.status(400).json(error)
    }
})

// SELECT * FROM users WHERE id=4;

app.get('/users/:id', async (req, res) => {
    try {
      const { id } = req.params

      const user = await User.findByPk(id)
      res.json(user)
    } catch (error) {
      res.status(400).json(error)
    }
  })

// PUT '/users' --> path params
app.put('/users/:id', async (req, res) => {
    try {
        const {id} = req.params
        const {body} = req

        await User.update(body, {
            where: {id}
        })

        res.status(204).end()
    } catch (error) {
        res.status(400).json(error)
    }
})

//DELETE
app.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params
    
        await User.destroy({
            where: {id}
        })
        res.status(204).end()
    } catch (error) {
        res.status(400).json(error)
    }
})

app.listen(POST, () => {
  console.log(`Servidor escuchando en el puerto ${POST}`);
});
