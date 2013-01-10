def login_reason_for(reason, subject)
  LoginReason.for(reason, subject).description
end

module LoginReason
  def self.for(reason, subject)
    class_name = "::LoginReason::#{reason.camelize}Reason"
    class_name = "::LoginReason::NilReason" unless const_defined? class_name
    class_name.constantize.new(subject).description
  end

  class NilReason
  end

  class VoteReason
  end

  class CommentReason
  end

  class VisitReason
  end

  class FollowReason
  end
end
