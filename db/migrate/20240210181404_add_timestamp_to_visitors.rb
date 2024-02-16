class AddTimestampToVisitors < ActiveRecord::Migration[7.1]
  def change
    add_column :visitors, :timestamp, :integer
  end
end
