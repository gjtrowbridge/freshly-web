module.exports = function(mongoose) {

  var express = require('express');
  var Activity = require('./activityModel.js');
  var Grid = require('gridfs-stream');
  Grid.mongo = mongoose.mongo;

  var gfs;
  mongoose.connection.once('open', function() {
    gfs = Grid(mongoose.connection.db);
  });

  var router = express.Router();

  router.route('/:activity_id/images/:image_id')
    .get(function(req, res) {
      res.json({message:'got here'});
    });

  router.route('/:activity_id')

    .get(function(req, res) {
      //Find activity
      Activity.findById(req.params.activity_id, function(err, activity) {
        
        //Return errors if necessary
        if (err) {
          res.send(err);
          return;
        }

        //Else returns activity object (JSON)
        res.json(activity);
      });
    })

    .put(function(req, res) {
      //Find activity
      Activity.findById(req.params.activity_id, function(err, activity) {

        //Return errors if necessary
        if (err) {
          res.send(err);
          return;
        }

        //Update activity
        activity.name = req.body.name;
        activity.description = req.body.description;
        activity.cost = req.body.cost;
        activity.time = req.body.time;
        activity.lat = req.body.lat;
        activity.lng = req.body.lng;
        activity.tags = req.body.tags;

        //Save activity
        activity.save(function(err) {

          //Return errors if necessary
          if (err) {
            res.send(err);
            return;
          }

          //Return message on success
          res.json({ 
            message: 'Activity updated: ' + activity._id,
            activity_id: activity._id
          });
        });
      });
    })

    .delete(function(req, res) {
      Activity.remove({
        _id: req.params.activity_id
      }, function(err, activity) {
        //Return errors if necessary
        if (err) {
          res.send(err);
          return;
        }

        //Return message on success
        res.json({ message: 'Successfully deleted' });
      });
    });

  //Handles interactions at /api/activities
  router.route('/')


    //Handles querying of all activities
    .get(function(req, res) {

      Activity.find(function(err, activities) {
        
        //Return errors if necessary
        if (err) {
          res.send(err);
          return;
        }

        //Return array of activity objects (JSON format)
        res.json(activities);
      });
    })

    //Handles creation of new activities
    .post(function(req, res) {

      //Create activity
      var activity = new Activity();
      activity.name = req.body.name;
      activity.description = req.body.description;
      activity.cost = req.body.cost;
      activity.time = req.body.time;
      activity.lat = req.body.lat;
      activity.lng = req.body.lng;
      activity.tags = req.body.tags;

      //Save activity
      activity.save(function(err, activity) {
        //Return errors if necessary
        if (err) {
          res.send(err);
          return;
        }

        //Return message on success
        res.json({ 
          message: 'Activity created: ' + activity._id,
          activity_id: activity._id
        });
      });

    });

    return router;
}
