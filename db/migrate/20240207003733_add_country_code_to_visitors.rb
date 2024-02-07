class AddCountryCodeToVisitors < ActiveRecord::Migration[7.1]
  def change
    add_column :visitors, :countryCode, :string

  end
end
