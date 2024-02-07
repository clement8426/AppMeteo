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

  after_create :cleanup_old_visitors

  private

  def cleanup_old_visitors
    excess_visitors_count = Visitor.count - 30

    if excess_visitors_count > 0
      visitors_to_delete = Visitor.order(created_at: :asc).limit(excess_visitors_count)
      visitors_to_delete.destroy_all
    end
  end

end
