class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :source
      t.string :ip
      t.string :user_agent
      t.string :referer
      t.string :platform
      t.string :browser
      t.string :device
      t.timestamps
    end
  end
end
