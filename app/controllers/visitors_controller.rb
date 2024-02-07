class VisitorsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:save_location]

  def save_location
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
end
