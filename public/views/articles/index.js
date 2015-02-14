/* global app:true */

(function() {
  'use strict';

  app = app || {};

  app.Article = Backbone.Model.extend({
    url: '/articles/',
    defaults: {
      success: false,
      errors: [],
      errfor: {},
      name: '',
      email: '',
      message: ''
    }
  });

  app.ArticleView = Backbone.View.extend({
    el: '.content',
    template: _.template( $('#tmpl-header').html() ),
    events: {
      'click .pressPlay': 'playAudio'
    },
    assign: function (selector) {
      this.setElement(this.$(selector)).render();
    },
    initialize: function() {
      this.listenTo(this.model, 'sync', this.render);
      this.render();
    },
    playAudio: function (argument) {
      // TODO: Figure out how to implement this audio callback
    },
    render: function() {
      this.$el.html(this.template( this.model.attributes ));
      return this
    }
  });

  $(document).ready(function() {
    app.firstLoad = true;
    app.router = new app.Router();
    Backbone.history.start();
  });
}());
