'use strict';

var thinky = require('thinky')({
   host: 'localhost',
   port: 28015,
   db: 'People',
});

var r =thinky.r;
var type=thinky.type;

var People = thinky.createModel('People',{
   firstName:type.string(),
   lastName:type.string(),
   coolnessFactor: type.number(),
   date: type.date().default(r.now())
});

People.ensureIndex('date');

exports.list = function (req, res) {
    People.orderBy({index:r.desc('date')}).run().then(function(people){
      res.json(People);
    }).error(function(err){
       res.json({message:err});
    });
};

exports.add = function (req, res) {
    var person = new People(req.body);
    person.save().then(function(result){
       res.json(result);
    }).error(function(err){
       res.json({message:err});
    });
};

exports.get = function (req, res) {
    People.get(req.param.id).run().then(function(person){
      res.json(person);
    }).error(function(err){
       res.json({message:err});
    });
};

exports.delete = function (req, res) {
  People.get(req.param.id).delete().execute().error(function(err){
        res.json(err)
      });
};

exports.update = function (req, res) {
  People.get(req.param.id).run().then(function(person){
     if(req.body.firstName){ person.firstName=req.body.firstName;}
     if(req.body.lastName){ person.lastName=req.body.lastName;}
     if(req.body.coolnessFactor){ person.coolnessFactor=parseInt(req.body.coolnessFactor); }
     person.date=r.now();

     person.save().then(function(result){
         res.json(result);
     }).error(function(err){
         res.json(err);
     });

  }).error(function(err){
     res.json(err);
  })
};
