const check = require('express-validator/check').check

let express = require('express');
let bodyParser = require('body-parser');
let router = express.Router();
let algrmts = require('../src/algoritms');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.use(bodyParser.json());

/*  GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'WebAPI Recaudaciones' });
});
/*  GET Recaudaciones Totales */
router.get('/recaudaciones', algrmts.getAll);

/*  POST Recaudacion detallada*/
router.get('/recaudaciones/detallada', [
    check('nameLastname'),
    check('payConcept').isLength({ min: 8, max: 8 }),
    check('dni').isLength({ min: 8, max: 8 }),
    check('code').isLength({ min: 8, max: 8 }),
    check('initDate').isAfter(),
    check('endDate'),
    check('receiptPayment').isLength({ min: 1 })
], algrmts.getComplet);

/*  POST Editar Recaudacion*/
router.post('/recaudaciones/id/', algrmts.validate);

/*  POST Añadir Recaudacion*/
router.post('/recaudaciones/new/', algrmts.insertNewCollection);

/* GET Listar Conceptos */
router.get('/conceptos', algrmts.getAllConcepts);

/* GET Listar Tipos */
router.get('/tipos', algrmts.getAllTypes);

/* GET Listar Ubicaciones */
router.get('/ubicaciones', algrmts.getAllUbications);

module.exports = router;