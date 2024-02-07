class AddWeatherDataToVisitors < ActiveRecord::Migration[7.1]
  def change
    add_column :visitors, :temperature, :float
    add_column :visitors, :windSpeed, :float
    add_column :visitors, :weatherCondition, :string
    add_column :visitors, :conditionText, :string
    add_column :visitors, :precipitation, :float
    add_column :visitors, :dayOrNight, :string
  end
end
