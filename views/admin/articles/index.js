'use strict';

exports.find = function(req, res, next){
  req.query.headline = req.query.headline ? req.query.headline : '';
  req.query.url = req.query.url ? req.query.url : '';
  req.query.limit = req.query.limit ? parseInt(req.query.limit, null) : 20;
  req.query.page = req.query.page ? parseInt(req.query.page, null) : 1;
  req.query.sort = req.query.sort ? req.query.sort : '_id';

  var filters = {};
  if (req.query.headline) {
    filters.headline = new RegExp('^.*?'+ req.query.headline +'.*$', 'i');
  }
  if (req.query.url) {
    filters.url = new RegExp('^.*?'+ req.query.url +'.*$', 'i');
  }

  req.app.db.models.Article.pagedFind({
    filters: filters,
    keys: 'headline url',
    limit: req.query.limit,
    page: req.query.page,
    sort: req.query.sort
  }, function(err, results) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
      results.filters = req.query;
      res.send(results);
    }
    else {
      results.filters = req.query;
      res.render('admin/articles/index', { data: { results: escape(JSON.stringify(results)) } });
    }
  });
};

exports.read = function(req, res, next){
  req.app.db.models.Article.findById(req.params.id).exec(function(err, article) {
    if (err) {
      return next(err);
    }

    if (req.xhr) {
      res.send(article);
    }
    else {
      res.render('admin/articles/details', { data: { record: escape(JSON.stringify(article)) } });
    }
  });
};

exports.create = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not create articles.');
      return workflow.emit('response');
    }

    if (!req.body.headline) {
      workflow.outcome.errors.push('A headline is required.');
      return workflow.emit('response');
    }

    if (!req.body.url) {
      workflow.outcome.errors.push('A url is required.');
      return workflow.emit('response');
    }

    workflow.emit('duplicateArticleCheck');
  });

  workflow.on('duplicateArticleCheck', function() {
    req.app.db.models.Article.findById(req.app.utility.slugify(req.body.headline +' '+ req.body.url)).exec(function(err, article) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (article) {
        workflow.outcome.errors.push('That article+headline is already taken.');
        return workflow.emit('response');
      }

      workflow.emit('createArticle');
    });
  });

  workflow.on('createArticle', function() {
    var fieldsToSet = {
      _id: req.app.utility.slugify(req.body.headline +' '+ req.body.url),
      headline: req.body.headline,
      url: req.body.url
    };

    req.app.db.models.Article.create(fieldsToSet, function(err, article) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.record = article;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.update = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not update articles.');
      return workflow.emit('response');
    }

    if (!req.body.headline) {
      workflow.outcome.errfor.headline = 'headline';
      return workflow.emit('response');
    }

    if (!req.body.url) {
      workflow.outcome.errfor.url = 'required';
      return workflow.emit('response');
    }

    workflow.emit('patchArticle');
  });

  workflow.on('patchArticle', function() {
    var fieldsToSet = {
      headline: req.body.headline,
      url: req.body.url
    };

    req.app.db.models.Article.findByIdAndUpdate(req.params.id, fieldsToSet, function(err, article) {
      if (err) {
        return workflow.emit('exception', err);
      }

      workflow.outcome.article = article;
      return workflow.emit('response');
    });
  });

  workflow.emit('validate');
};

exports.delete = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    if (!req.user.roles.admin.isMemberOf('root')) {
      workflow.outcome.errors.push('You may not delete articles.');
      return workflow.emit('response');
    }
    workflow.emit('deleteArticle');
  });

  workflow.on('deleteArticle', function(err) {
    req.app.db.models.Article.findByIdAndRemove(req.params.id, function(err, article) {
      if (err) {
        return workflow.emit('exception', err);
      }
      workflow.emit('response');
    });
  });

  workflow.emit('validate');
};
