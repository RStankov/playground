require File.dirname(__FILE__) + '/../spec_helper'

describe "update/create translations" do
  before(:all) do
    I18n.locale = :bg
  end
  
  describe "new record" do
    before do
      @post = Post.new :title => "test title", :text => "test text"
    end
    
    it "should have correct title and text" do
      @post.title.should == "test title"
      @post.text.should  == "test text"
    end
    
    it "should have correct title and text delegated to translation" do
      @post.translation.title.should == "test title"
      @post.translation.text.should  == "test text"
    end
    
    it "should persist title/text on creation" do
      @post.save.should be_true
      @post.reload
      
      post = Post.find(@post.id)
      post.title.should == "test title"
      post.text.should  == "test text"
      
      post.translation.id           == @post.translation.id
      post.translation.title.should == "test title"
      post.translation.text.should  == "test text"
    end
  end
  
  describe "existing record" do
    before do
      @post = Post.create :title => "title1", :text => "text1"
    end
    
    it "should updates it's title/text for the record and it's translation" do
      @post.update_attributes :title => "title2", :text => "text2"
      
      post = Post.find(@post.id)
      post.title.should == "title2"
      post.text.should  == "text2"
      
      post.translation.id           == @post.translation.id
      post.translation.title.should == "title2"
      post.translation.text.should  == "text2"
    end
  end
  
  # draft
  describe "translation method" do
    it "should be accessible trougth translation(locale) and thro" do
      @post = Post.new
      @post.translation(I18n.locale).title = "test"
      @post.translation(:en).title = "test2"
      
      @post.title.should == "test"
      @post.translation(:en).title = "test2"
    end
  end
  
  describe "translation_attributes= method" do
    it "should description" do
#      @post = Post.new({
#        :translation_attributes => {
#          :bg => {:title => "title1", :text => "text1"},
#          :en => {:title => "title2", :text => "text2"}
#        }
#      })
      
      @post = Post.new({
        "translation_attributes" => {
          "bg" => {"title" => "title1", "text" => "text1"},
          "en" => {"title" => "title2", "text" => "text2"}
        }
      })
      
      @post.title.should == "title1"
      @post.text.should  == "text1"
      
      @post.translation(:bg).title.should == "title1"
      @post.translation(:bg).text.should  == "text1"
      
      @post.translation("bg").title.should == "title1"
      @post.translation("bg").text.should  == "text1"
      
      @post.translation(:en).title.should == "title2"
      @post.translation(:en).text.should  == "text2"
      
      @post.save.should be_true
      
      @post2 = Post.find @post.id
      
      @post2.title.should == "title1"
      @post2.text.should  == "text1"

      @post2.translation(:bg).title.should == "title1"
      @post2.translation(:bg).text.should  == "text1"
      
      @post2.translation(:en).title.should == "title2"
      @post2.translation(:en).text.should  == "text2"
    end
  end
end
