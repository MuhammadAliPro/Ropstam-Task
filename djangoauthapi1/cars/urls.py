from django.urls import path
from.import views

urlpatterns = [
    path('api/getcar',views.getCar.as_view()),
    path('api/getcarbyid/<str:pk>',views.getCarById),
    path ('api/addcar',views.addCar),
    path ('api/updatecar/<str:pk>',views.updateCar),
    path ('api/deletecar/<str:pk>',views.deleteCar),
    path('api/getcatagory',views.getCatagory),
    path('api/getcarsbycatagory/<str:pk>',views.getCarsByCatagory.as_view()),
    path ('api/addcatagory',views.addCatagory),
    path ('api/updatecatagory/<str:pk>',views.updateCatagory),
    path ('api/deletecatagory/<str:pk>',views.deleteCatagory),
    
] 
