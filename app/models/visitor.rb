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
  validates :timestamp, presence: true
  before_create :set_timestamp

  after_create :cleanup_old_visitors

  private

  def cleanup_old_visitors
    excess_visitors_count = Visitor.count - 30

    if excess_visitors_count > 0
      visitors_to_delete = Visitor.order(created_at: :asc).limit(excess_visitors_count)
      visitors_to_delete.destroy_all
    end
  end

  def set_timestamp
    self.timestamp = Time.current.to_i
  end
end
