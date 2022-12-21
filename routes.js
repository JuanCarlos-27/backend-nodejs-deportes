const express = require('express');
const routes = express.Router()

routes.get('/:table', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send("¡ERROR!" + err)
        let sql = 'SELECT * FROM ' + req.params.table;
        conn.query(sql, (err, rows) => {
            if (err) return res.send("¡ERROR!" + err)
            res.json(rows)
        })
    })
})

//Post - insert
routes.post('/:table', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send("¡ERROR!" + err)

        let sql = `INSERT INTO ${req.params.table} set ? `
        conn.query(sql, [req.body], (err, rows) => {
            if (err){
                res.status(400);
                return res.send("¡ERROR!" + err) 
            } 
            res.send("Add OK!")
        })
    })
})
// Acción --> Eliminar
routes.delete('/:table/:pk/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send("¡ERROR!" + err)
        let sql = `DELETE FROM ${req.params.table} WHERE ${req.params.pk} = ? `
        conn.query(sql, [req.params.id], (err, rows) => {
            if (err) return res.status(404).send("¡ERROR!" + err)
            res.send("Deleted OK!")
        })
    })
})
// Acción --> Actualizar
routes.put('/:table/:pk/:id', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send("¡ERROR!" + err)
        let sql = `UPDATE ${req.params.table} SET ? WHERE ${req.params.pk} = ?`
        conn.query(sql, [req.body, req.params.id], (err, rows) => {
            if (err) return res.send("¡ERROR!" + err)
            res.send("UPDATE OK!")
        })
    })
})

// Consulta para inicio de sesión 
routes.get('/:table/:email/:clave', (req, res) => {
    req.getConnection((err, conn) => {
        if (err) return res.send(err)
        let ssql = "select * from " + req.params.table + " where usu_email='" + req.params.email + "' and usu_clave='" + req.params.clave + "'" 
        conn.query(ssql, (err, rows) => { 
            if (err) return res.send(err) 
            res.json(rows) 
        })
    })
})

//Consulta para tabla de eventos
routes.get('/:table/consulta', (req, res)=>{
    req.getConnection((err, conn) =>{
        if(err) return res.send(err)
        let query = 'SELECT eve_id, eq1.equ_id as id_equipo1, eq1.equ_nombre as equipo1 , eq1.equ_imagen as equipo1_img, eq2.equ_id as id_equipo2, eq2.equ_nombre as equipo2, eq2.equ_imagen as equipo2_img,'
        query += 'dep_id, dep_nombre, eve_fecha, eve_hora, eve_marcador_equipo1, eve_marcador_equipo2, eve_estado '
        query += 'FROM deportes JOIN eventos ON dep_id = eve_tipo_deporte '
        query += 'JOIN equipos eq1 ON eve_equipo1 = eq1.equ_id '
        query += 'JOIN equipos eq2 ON eve_equipo2 = eq2.equ_id ORDER BY YEAR(eve_fecha) DESC'

        conn.query(query, (err, rows) =>{
            if(err) return res.send(err)
            res.json(rows)
        })
    })
})

module.exports = routes