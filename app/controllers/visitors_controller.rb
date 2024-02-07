class VisitorsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]


  def create
    @visitor = Visitor.new(visitor_params)

    if @visitor.save
      render json: { message: 'Position enregistrée avec succès' }, status: :ok
    else
      render json: { error: 'Erreur lors de l\'enregistrement de la position' }, status: :unprocessable_entity
    end
  end

  private

  def visitor_params
    params.require(:visitors).permit(:country, :city, :userIP, :countryCode, :temperature, :windSpeed, :weatherCondition, :conditionText, :precipitation, :dayOrNight)
  end

  def cleanup_old_visitors
    excess_visitors_count = Visitor.count - 40

    if excess_visitors_count > 0
      visitors_to_delete = Visitor.order(created_at: :asc).limit(excess_visitors_count)
      visitors_to_delete.destroy_all
    end
  end
end