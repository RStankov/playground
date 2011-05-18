require "spec_helper"

describe Foo do
  it "a" do
    Foo.new.a.should == "b"
  end
end