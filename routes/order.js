var express = require("express")
var router = express.Router();
const Validator = require('fastest-validator')
const bodyParser = require('body-parser');
const v = new Validator()
const {orders} = require("../models")

router.get("/", function(req,res,next){
    res.send("Hello World");
});
router.get("/env", function(req,res,next){
    res.send(process.env.APP_NAME);
});

//POST (buat orderan baru) url: http://localhost:3000/order/orders
router.post('/orders', async(req, res) => {
    const schema = {
      username:'string',
      email:'string',
      jenis_sampah: 'string',
      berat_sampah: 'number',
      lokasi_pengepul: 'string',
      lokasi_user: 'string',
      catatan: 'string'
    }
    
    // validasi body request
    const validate = v.validate (req.body, schema);
    
    if (validate.length){
      return res.status(400)
      .json(validate);
    }

    const { username, email, jenis_sampah, berat_sampah, lokasi_pengepul, lokasi_user, catatan } = req.body;

    // kalkulasi reward points sama hargaPerKg
    let points;
    let hargaPerKg;
  
    switch (jenis_sampah) {
      case 'Minyak':
        points = 100;
        hargaPerKg = 9500;
        break;
      case 'Logam':
        points = 150;
        hargaPerKg = 13000;
        break;
      case 'Kertas':
        points = 70;
        hargaPerKg = 5000;
        break;
      case 'Organik':
        points = 50;
        hargaPerKg = 3000;
        break;
      default:
        points = 0;
        hargaPerKg = 0;
        break;
    }
  
    try {
      const order = await orders.create({
        username,
        email,
        jenis_sampah,
        hargaPerKg,
        berat_sampah,
        points,
        lokasi_pengepul,
        lokasi_user,
        catatan
      });
  
      res.status(201)
      .json({message: 'Order kamu berhasil!', data:order});
    } catch (error) {
      console.error(error);
      res.status(500)
      .json({ error: 'Internal server error' });
    }
  
  });

//GET (semua list orderannya user) url: http://localhost:3000/order/orders
router.get('/orders', async (req, res) => {
  
    try {
      const order = await orders.findAll({
        order: [['createdAt', 'DESC'],
        ['updatedAt', 'DESC'],
      ],
      });
      res.json({message: 'List semua data yang masuk', data:order});
    } 
    catch (error) {
      res.status(500)
      .json({ error: 'Internal server error' });
    }
  });

//GET (orderan by id) url: http://localhost:3000/order/orders/:id
router.get('/orders/:id', async (req, res) => {
    const id = parseInt(req.params.id);
  
    try {
      const order = await orders.findByPk(id);
      if (!order) {
        res.status(404)
        .json({ error: 'Order tidak ditemukan' });
        return;
      }
      res.json({data:order});
    } catch (error) {
      res.status(500)
      .json({ error: 'Internal server error' });
    }
  });

//GET (orderan by email) url: http://localhost:3000/order/orders/email/:email
router.get('/orders/email/:email', async (req, res) => {
    const email = req.params.email;
  
    try {
      let order = await orders.findAll({ where: { email }});
      if (!order) {
        res.status(404)
        .json({ error: 'Order tidak ditemukan' });
        return;
      }
      res.json({data:order});
    } catch (error) {
      res.status(500)
      .json({ error: 'Internal server error' });
    }
  });  

//GET (status delivery tukang pengepul sampah) url: http://localhost:3000/order/orders/:id/lacak
router.get('/orders/:id/lacak', async (req, res) => {
    const id = parseInt(req.params.id);
  
    try {
      let order = await orders.findByPk(id);
      if (!order) {
        res.status(404).json({ error: 'Order tidak ditemukan' });
        return;
      }
  
      res.json({ status: order.status_pemesanan });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  //GET (total uang hasil user menjual barang2 bekas) url: http://localhost:3000/order/users/:username/price
  router.get('/users/:username/price', async (req, res) => {
    const {username} = req.params;
  
    try {
      let pesananuser = await orders.findAll({ where: { username } });
      const total_income_jual_sampah = pesananuser.reduce((acc, order) => {
        const { jenis_sampah, berat_sampah, hargaPerKg } = order;
        return acc + berat_sampah * hargaPerKg;
      }, 0);
  
      res.json({ total_income_jual_sampah });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // GET (total pendapatan points setiap user) url: http://localhost:3000/order/users/:username/totalpoints
//   router.get('/users/:username/totalpoints', async (req, res) => {
//     const {username} = req.params;
  
//     try {
//       let pesananuser = await orders.findAll({ where: { username } });
//       const totalPoints = pesananuser.reduce((acc, order) => {
//         const { berat_sampah, points } = order;
//         return acc + berat_sampah * points;
//       }, 0);
  
//       res.json({ totalPoints });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

module.exports = router;