class Visitor < ApplicationRecord
  validates :country, presence: true
  validates :city, presence: true
  validates :userIP, presence: true
  validates :countryCode, presence: true
  validates :temperature, presence: true
  validates :windSpeed, presence: true
  validates :weatherCondition, presence: true
  validates :conditionText, presence: true
  validates :precipitation, presence: true
  validates :dayOrNight, presence: true
end
