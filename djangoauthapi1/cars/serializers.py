from rest_framework import serializers
from .models import Cars,Catagories



class CatagoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Catagories
        fields = '__all__'


class CarsSerializer(serializers.ModelSerializer):
    catagory = CatagoriesSerializer(many=False)
    class Meta:
        model = Cars
        fields = ("catagory",
        'id',
    "model",
    "color" ,
    "registrationNo" )

class postCarsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cars
        fields = '__all__'