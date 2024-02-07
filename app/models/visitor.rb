class Visitor < ApplicationRecord
  validates :country, presence: true
  validates :city, presence: true
  validates :userIP, presence: true
  validates :countryCode, presence: true
end
