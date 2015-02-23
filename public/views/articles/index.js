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
    events: {
      'click .pressPlay': 'playAudio'
    },
    assign: function (selector) {
      this.setElement(this.$(selector)).render();
    },
    initialize: function() {
      this.render();
    },
    playAudio: function (argument) {
      console.log("pressPlay activated!");
    },
    render: function() {
      return this;
    }
  });

  $(document).ready(function() {
    app.ArticleView = new app.ArticleView();
  });
}());
