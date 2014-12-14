class ArticlesController < ApplicationController
  before_action :set_article, only: [:show, :edit, :update, :destroy]

  # GET /articles
  # GET /articles.json
  def index
    @article_metadata = []
    response = HTTParty.get("http://api.nytimes.com/svc/search/v2/articlesearch.json?q=obama&begin_date=20141201&end_date=20141213&api-key=57a29334498a380ff95dcd0d7b41ba9b%3A19%3A70275971")
    first_four = response['response']['docs'].reject {|article| article['multimedia'].empty?}.take(4)
    first_four.each do |article|
      article_metadatum = {
        :headline => article['headline']['main'],
        :image => article['multimedia'].select{|img| img['width'] == 600 && img['subtype'] == 'xlarge'}.first['url']
      }
      @article_metadata << article_metadatum
    end
  end

  # GET /articles/1
  # GET /articles/1.json
  def show
    @abstract = "Editorial contends that summary of Senate investigation report into Central Intelligence Agency's torture and illegal detention of prisoners is portrait of depravity; questions why no one has ever been held accountable for these seeming crimes; laments that nothing is likely to be done now, given that Republicans will soon control Senate."
    @title = "The Senate Report on the C.I.A.'s Torture and Lies"
    @image_url = "http://www.nytimes.com/images/2014/12/10/opinion/10wed1sub/10wed1sub-articleLarge.jpg"
    @translate_url_prefix = "http://translate.google.com/translate_tts?tl=en&q="
  end

  # GET /articles/new
  def new
    @article = Article.new
  end

  # GET /articles/1/edit
  def edit
  end

  # POST /articles
  # POST /articles.json
  def create
    @article = Article.new(article_params)

    respond_to do |format|
      if @article.save
        format.html { redirect_to @article, notice: 'Article was successfully created.' }
        format.json { render :show, status: :created, location: @article }
      else
        format.html { render :new }
        format.json { render json: @article.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /articles/1
  # PATCH/PUT /articles/1.json
  def update
    respond_to do |format|
      if @article.update(article_params)
        format.html { redirect_to @article, notice: 'Article was successfully updated.' }
        format.json { render :show, status: :ok, location: @article }
      else
        format.html { render :edit }
        format.json { render json: @article.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /articles/1
  # DELETE /articles/1.json
  def destroy
    @article.destroy
    respond_to do |format|
      format.html { redirect_to articles_url, notice: 'Article was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_article
      #@article = Article.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def article_params
      params[:article]
    end
end
