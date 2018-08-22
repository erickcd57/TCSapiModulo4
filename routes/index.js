const check = require('express-validator/check').check,
    trim = require('express-validator/check').trim,
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    algrmts = require('../src/algoritms')

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.use(bodyParser.json());

/*  GET home page. */
router.get('/', function(req, res, next) {
    console.log(__dirname)
    res.sendFile(path.resolve('public/documentation.html'));
});
/*  GET Recaudaciones Totales */
router.get('/recaudaciones', algrmts.getAll);

/*  POST Recaudacion detallada*/
router.get('/recaudaciones/detallada', [
    check('nameLastname').trim().isLength({max:70}),
    check('payConcept').trim().isLength({ min: 8, max: 8 }),
    check('dni').trim().isLength({ min: 8, max: 8 }),
    check('code').trim().isLength({ min: 8, max: 8 }),
    check('initDate').trim(),
    check('endDate').trim(),
    check('receiptPayment').trim().isLength({ max: 10 })
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