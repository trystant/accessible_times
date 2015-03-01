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
    close: function(){
      console.log("Cancelling the synthesizer");
      window.speechSynthesis.cancel();
      console.log("Cancelled the synthesizer");
      this.remove();
      this.unbind();
      this.model.unbind("click", this.playAudio);
    },
    playAudio: function (argument) {
      var elements = $("h1");
      for (var i = 0, len = elements.length; i < len; i++) {
        if (window.speechSynthesis !== undefined) {
          var text = elements[i].innerHTML;
          var utterance = new SpeechSynthesisUtterance(text);
          console.log("Utterance Instance Text: " + text);
          speechUtteranceChunker(utterance, {chunkLength: 160}, function () {
            //some code to execute when done
            console.log("Paragraph " + len + " done");
         });
        };
      };
    },
    render: function() {
      return this;
    }
  });

  $(document).ready(function() {
    app.ArticleView = new app.ArticleView();
  });
}());
