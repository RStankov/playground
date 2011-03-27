require File.dirname(__FILE__) + '/../spec_helper'

describe "FormBuilder fields_for_translations method" do  
  include ActionView::Helpers::FormHelper
  include ActionView::Helpers::FormTagHelper
  include ActionView::Helpers::FormOptionsHelper
  include ActionView::Helpers::UrlHelper
  include ActionView::Helpers::TagHelper
  include ActionView::Helpers::TextHelper
  include ActionView::Helpers::ActiveRecordHelper
  include ActionView::Helpers::RecordIdentificationHelper
  include ActionView::Helpers::DateHelper
  include ActionView::Helpers::CaptureHelper
  include ActionView::Helpers::AssetTagHelper
  include ActiveSupport
  include ActionController::PolymorphicRoutes
  
  def posts_path
    ""
  end
  
  def post_path(post)
    ""
  end
  
  def protect_against_forgery?
    false
  end
    
  attr_accessor :output_buffer
    
  before :each do
    @output_buffer = ""
    form_for Post.new do |form|
        @form = form
    end
  end
  
  it "should be in default form build" do
    @form.should respond_to(:fields_for_translations)
  end
  
  it "should yield translation form build object and given locale" do
    locales = []
    @form.fields_for_translations([:bg, :en, :de]) do |translation, locale|
      translation.object.is_a?(PostTranslation).should be_true
      locales << locale
    end
    locales.should == [:bg, :en, :de]
  end
  
  it "should give only the available locales when called with no arguments" do
    locales = []
    @form.fields_for_translations do |translation, locale|
      locales << locale
    end
    locales.should == I18n.available_locales
  end
  
  it "should format the name as model[translation_attributes][:locale][:column]" do
    @form.fields_for_translations([:bg, :en]) do |translation, locale|
       translation.text_field(:title).include?("name=\"post[translation_attributes][#{locale}][title]\"").should be_true
       translation.text_field(:text).include?("name=\"post[translation_attributes][#{locale}][text]\"").should be_true
    end
  end
end