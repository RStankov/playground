class User < ActiveRecord::Base
  # Relations
  # Validations
  # Scopes

  after_create :reset_perishable_token!
  after_create :record_registration_ip
  after_create :sync_newsletter_subscription

  def verify_settings(params = {})
  end
  alias_method :register, :verify_settings

  def register!(params = {})
  end

  def mark_as_verified
  end

  def confirm
  end

  def send_confirmation_email
  end

  def deliver_password_reset_instructions!
  end

  def activate
  end

  def deactivate
  end

  def voted_looks(limit = nil)
  end

  def has_voted_for?(look)
  end

  def following?(followee)
  end

  def followed_normal_users
  end

  def followed_designers
  end

  def active_email_notifications
  end

  def turn_off_email_notifications
  end

  def record_registration_ip
    update_attributes :registration_ip => current_login_ip
  end

  def newsletter_token
  end

  def sync_newsletter_subscription
  end

  def full_name
  end

  def designer?
  end

  def facebook_user?
  end
end
