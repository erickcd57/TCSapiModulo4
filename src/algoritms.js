let q = require('../src/queries');
connection = require('../src/dbconnection');

const indice_name = 'alumno.ape_nom';
const indice_concepto = 'concepto.concepto';
const indice_voucher = 'numero';
const indice_fecha = 'fecha';
const indice_recaudacion = "id_rec";
const indice_flag = 'validado';
const indice_dni = 'alumno.dni';
const indice_obs = 'observacion';
const indice_codigo = 'alumno.codigo';
const indice_ubic = 'id_ubicacion';
const validationResult = require('express-validator/check').validationResult;

function when_construct(ListIndices, ListValor, tipo) {
    let when = "";
    let valores = ListValor.split('¬');
    let indices = ListIndices.split(',');
    if (ListIndices != null && ListValor != null) {
        for (let i = 0; i < valores.length; i++) {
            if (tipo === indice_obs) valores[i] = "'" + valores[i] + "'";
            when = when + "WHEN " + indices[i] + " THEN " + valores[i] + " ";
        }
        when = when + "END";
    }
    return when;
}

function where_construct(ListValor, indice) {
    let where = "";
    if (ListValor != null) {
        let valores = ListValor.split(',');
        for (let i = 0; i < valores.length; i++) valores[i] = valores[i].trim();
        if (indice === indice_name) {
            let tam = valores.length;
            for (let i = 0; i < tam; i++) {
                let noms = valores[i].split(' ');
                switch (noms.length) {
                    case 1:
                        where = "( ";
                        for (let i = 0; i < valores.length; i++) {
                            let noms = valores[i].split(' ');
                            noms[0] = noms[0].toUpperCase();
                            if (noms.length === 2) {
                                noms[1] = noms[1].toUpperCase();
                                where = where + indice + " SIMILAR TO '%" + noms[0] + "%" + noms[1] + "%' OR " + indice +
                                    " SIMILAR TO '%" + noms[1] + "%" + noms[0] + "%' OR ";
                            } else
                                where = where + indice + " SIMILAR TO '%" + noms[0] + "%' OR ";
                        }
                        where = where.slice(0, -3);
                        where = where + ")";
                        return where;
                    case 2:
                        where = "( ";
                        for (let i = 0; i < valores.length; i++) {
                            let noms = valores[i].split(' ');
                            noms[0] = noms[0].toUpperCase();
                            if (noms.length === 2) {
                                noms[1] = noms[1].toUpperCase();
                                where = where + indice + " SIMILAR TO '%" + noms[0] + "%" + noms[1] + "%' OR " + indice +
                                    " SIMILAR TO '%" + noms[1] + "%" + noms[0] + "%' OR ";
                            } else
                                where = where + indice + " SIMILAR TO '%" + noms[0] + "%' OR ";
                        }
                        where = where.slice(0, -3);
                        where = where + ")";
                        return where;
                    case 3:
                        where = "( ";
                        for (let i = 0; i < valores.length; i++) {
                            let noms = valores[i].split(' ');
                            noms[0] = noms[0].toUpperCase();
                            noms[1] = noms[1].toUpperCase();
                            noms[2] = noms[2].toUpperCase();
                            where = where + indice + " SIMILAR TO '%" + noms[0] + "%" + noms[1] + "%" + noms[2] + "%' OR " + indice +
                                " SIMILAR TO '%" + noms[1] + "%" + noms[2] + "%" + noms[0] + "%' OR ";
                        }
                        where = where.slice(0, -3);
                        where = where + ")";
                        return where;
                    case 4:
                        noms[0] = noms[0].toUpperCase();
                        noms[1] = noms[1].toUpperCase();
                        noms[2] = noms[2].toUpperCase();
                        noms[3] = noms[3].toUpperCase();
                        valores.push(`${noms[0]} ${noms[1]} ${noms[2]} ${noms[3]}`);
                        valores.push(`${noms[2]} ${noms[3]} ${noms[0]} ${noms[1]}`);
                }
            }
        }
        let valorcomillas = "";
        for (let i = 0; i < valores.length; i++)
            valorcomillas = valorcomillas + "'" + valores[i] + "',";
        valorcomillas = valorcomillas.slice(0, -1);
        where = where + indice + " IN (" + valorcomillas + ")";
    } else
        where = 'true';
    return where;
}

function getAll(req, res, next) {
    q.SelectCollection(req, res, next, "");
}

/**
 *
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
function getComplet(req, res, next) {
    let nameLastname = req.query.nameLastname,
        payConcept = req.query.payConcept,
        dni = req.query.dni,
        code = req.query.code,
        initDate = req.query.initDate,
        endDate = req.query.endDate,
        receiptPayment = req.query.receiptPayment

    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    
    connection.query("Select * from sp_get_collections1($1,$2,$3,$4,$5,$6,$7)")
        .then(data=>{
            return res.status(200).send({
                message: resp.rows
            })
        })    
        .catch(err=>{
            return res.status(500).send({
                message: err.stack
            })
        })

    // , (err, resp) => {
    //     if (err) {
    //         return res.status(500).send({
    //             message: err.stack
    //         })
    //     } else {
    //         return res.status(200).send({
    //             message: resp.rows
    //         })
    //     }
    // })
}

function validate(req, res, next) {
    let jsonR = req.body;
    let indices = "";
    let check = "";
    let obs = "";
    let ubic = "";
    for (let i in jsonR) {
        if (jsonR.hasOwnProperty(i)) {
            indices = indices + ',' + jsonR[i].id_rec;
            check = check + '¬' + jsonR[i].check;
            obs = obs + '¬' + jsonR[i].obs;
            ubic = ubic + '¬' + jsonR[i].ubic;
        }
    }
    indices = indices.slice(1);
    check = check.slice(1);
    obs = obs.slice(1);
    ubic = ubic.slice(1);
    if (indices != null && check != null && obs != null && ubic != null) {
        let v = when_construct(indices, check);
        let v2 = when_construct(indices, obs, indice_obs);
        let v3 = when_construct(indices, ubic);
        q.UpdateQuery(req, res, next, v, v2, v3, indices);
    }
}

function insertNewCollection(req, res, next) {
    let jsonR = req.body;
    let va = "('" + jsonR.id_alum + "'," +
        "'" + jsonR.id_concepto + "', '2103', '" + jsonR.id_ubicacion + "','" + jsonR.id_alum + "'," +
        "'" + jsonR.numero + "','" + jsonR.importe + "','" + jsonR.observacion + "','" + jsonR.fecha + "'," +
        jsonR.validado + ",'" + jsonR.tipo + "')";
    q.InsertQuery(req, res, next, va);
}

function getAllConcepts(req, res, next) {
    q.SelectGeneral(req, res, next, "concepto");
}

function getAllTypes(req, res, next) {
    q.SelectGeneral(req, res, next, "tipo");
}

function getAllUbications(req, res, next) {
    q.SelectGeneral(req, res, next, "ubicacion");
}

function sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
}
module.exports = {
    getAll: getAll,
    getComplet: getComplet,
    validate: validate,
    insertNewCollection: insertNewCollection,
    getAllConcepts: getAllConcepts,
    getAllTypes: getAllTypes,
    getAllUbications: getAllUbications,
    i_name: indice_name,
    i_concepto: indice_concepto,
    i_voucher: indice_voucher,
    i_fecha: indice_fecha,
    i_recaudacion: indice_recaudacion,
    i_flag: indice_flag,
    i_dni: indice_dni,
    i_obs: indice_obs,
    i_codigo: indice_codigo,
    i_ubic: indice_ubic
};