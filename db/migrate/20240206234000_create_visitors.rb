class CreateVisitors < ActiveRecord::Migration[7.1]
  def change
    create_table :visitors do |t|
      t.string :city
      t.string :country
      t.date :date

      t.timestamps
    end
  end
end
