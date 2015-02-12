'use strict';

exports = module.exports = function(app, mongoose) {
  var articleSchema = new mongoose.Schema({
  	_id: { type: String },
    headline: { type: String, default: '' },
    url: { type: String, default: '' }
  });
 	articleSchema.plugin(require('./plugins/pagedFind'));
  articleSchema.index({ headline: 1 });
  articleSchema.index({ url: 1 });
  articleSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Article', articleSchema);
};