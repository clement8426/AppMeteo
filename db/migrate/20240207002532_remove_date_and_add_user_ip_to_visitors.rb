class RemoveDateAndAddUserIpToVisitors < ActiveRecord::Migration[7.1]
  def change
    remove_column :visitors, :date, :date
    add_column :visitors, :userIP, :string
  end
end
