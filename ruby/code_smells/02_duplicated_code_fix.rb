class ArticlesController < ApplicationController
  respond_to :html, :json

  def index
    @articles = Article.all
    respond_with @articles
  end

  def show
    @article = find_article
    respond_with @article
  end

  def new
    @article = Article.new
    respond_with @article
  end

  def edit
    @article = find_article
  end

  def create
    @article = Article.new article_params
    @article.save

    respond_with @article, flash: {notice: 'Article was successfully created.'}
  end

  def update
    @article = find_article
    @article.update article_params

    respond_with @article, flash: {notice: 'Article was successfully update.'}
  end

  def destroy
    @article = find_article
    @article.destroy

    respond_with @article
  end

  private

  def find_article
    Article.find params[:id]
  end

  def article_params
    params.require(:article).permit :name, :content, :published_on, :tags, :properties
  end
end
