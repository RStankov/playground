class DesignerChecker
  def initialize(user)
    @user = user
  end

  def designer?
    @user.designer?
  end
end
