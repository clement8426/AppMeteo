class VisitorsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]

  def create
    @visitor = Visitor.new(visitor_params)
    @visitor.timestamp = Time.current.to_i # Assigner le timestamp Unix actuel

    if @visitor.save
      cleanup_old_visitors
      render json: { status: 'success' }
    else
      render json: { status: 'error', message: @visitor.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def recent_searches
    @recent_searches = Visitor.select(:id, :country, :city, :userIP, :countryCode, :temperature, :windSpeed, :weatherCondition, :conditionText, :precipitation, :dayOrNight, :created_at, :timestamp)
                               .order(created_at: :desc)
                               .limit(10)
                               .as_json(only: [:id, :country, :city, :userIP, :countryCode, :temperature, :windSpeed, :weatherCondition, :conditionText, :precipitation, :dayOrNight, :created_at, :timestamp])
    render json: @recent_searches
  end

  private

  def visitor_params
    params.require(:visitors).permit(:country, :city, :userIP, :countryCode, :temperature, :windSpeed, :weatherCondition, :conditionText, :precipitation, :dayOrNight, :timestamp)
  end

  def cleanup_old_visitors
    excess_visitors_count = Visitor.count - 40

    if excess_visitors_count > 0
      visitors_to_delete = Visitor.order(created_at: :asc).limit(excess_visitors_count)
      visitors_to_delete.destroy_all
    end
  end
end
