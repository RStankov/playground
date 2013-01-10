class User < ActiveRecord::Base
  # Relations
  # Validations
  # Scopes

  # UserRegistration object
  #
  # after_create :reset_perishable_token!
  # after_create :record_registration_ip
  # after_create :sync_newsletter_subscription
  #
  # def verify_settings(params = {})
  # end
  # alias_method :register, :verify_settings
  #
  # def register!(params = {})
  # end
  #
  # def mark_as_verified
  # end
  #
  # def confirm
  # end
  #
  # def send_confirmation_email
  # end

  # UserPasswordReset.new
  #
  # def deliver_password_reset_instructions!
  # end

  # UserActivator.new(user).active
  # UserActivator.new(user).deactivate
  #
  # def activate
  # end
  #
  # def deactivate
  # end

  # LooksVote.voted_by(user, limit)
  # LooksVote.voted_for?(user, look)
  #
  # def voted_looks(limit = nil)
  # end
  #
  # def has_voted_for?(look)
  # end

  # UserFollowing.new(user).following(user)
  # UserFollowing.new(user).followed_designers
  # UserFollowing.new(user).followed_users
  #
  # def following?(followee)
  #   Following.following? self, followee
  # end
  #
  # def followed_normal_users
  #   followed_users.includes(:label).where(:labels => {:id => nil})
  # end
  #
  # def followed_designers
  #   followed_users.joins(:label)
  # end

  # UserNotifications.new(user).active
  # UserNotifications.new(user).turn_off
  #
  # def active_email_notifications
  # end
  #
  # def turn_off_email_notifications
  # end

  # UserRegistration.new
  #
  # def record_registration_ip
  #   update_attributes :registration_ip => current_login_ip
  # end

  def full_name
  end

  def designer?
  end

  def facebook_user?
  end

  # NewsletterSubscription.token_for_user(user)
  #
  # def newsletter_token
  # end

  # UserRegistration.new
  # NewsletterSubscription.sync_for_user(user)
  #
  # def sync_newsletter_subscription
  # end
end
